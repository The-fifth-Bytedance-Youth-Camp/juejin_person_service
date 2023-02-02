const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const fs = require('fs');
const rotatingFileStream = require('rotating-file-stream');
const morgan = require('morgan');
const dotenv = require('dotenv');
const expressJwt = require('express-jwt');
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

const logPath = path.join(__dirname, './logs');
if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

const proLogger = morgan('combined', {
    immediate: false,
    skip(_, res) {
        return res.statusCode < 400;
    },
    stream: rotatingFileStream.createStream(
        `${ new Date().toISOString().slice(0, 10) }-error.log`,
        {
            interval: '1d',
            path: logPath,
        }),
});

// 验证 token 是否过期
app.use(expressJwt.expressjwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: [ 'HS256' ],
}).unless({
    // 不需要验证的接口名称
    path: [ '/', /^\/upload\/.*/, /^\/login\/.*/, /\/insert$/ ],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(isProduction ? proLogger : morgan('dev'));

function delDir(dir) {
    let files = fs.readdirSync(dir);
    for (let file of files) {
        let newPath = path.join(dir, file);
        let stats = fs.statSync(newPath);
        if (stats.isFile()) {
            fs.unlinkSync(newPath);
        } else {
            delDir(newPath);
        }
    }
}

// 每个月清理一次日志
cron.schedule('0 0 */30 * *', () => {
    delDir(logPath);
});

module.exports = app;
