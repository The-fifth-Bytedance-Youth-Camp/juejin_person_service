const express = require('express');
const router = express.Router();
const database = require('../utils/database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const md5 = require('md5');

dotenv.config();

// 用户名密码登录
function byPassword(table) {
    const isAdmin = table === 'admin';
    return async (req, res) => {
        let { name, password } = req.body;
        if (!name || !password) {
            res.json({
                code: 401,
                msg: '用户名与密码为必传参数',
            });
            return;
        }
        password = md5(password);
        try {
            const result = await database
                .select('*')
                .from(table)
                .where('name', name)
                .where('password', password)
                .queryRow();
            if (result) {
                const token = jwt.sign(
                    { id: result?.id, name, isAdmin },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '30days' },
                );
                res.json({
                    code: 200,
                    msg: '登录成功',
                    token,
                });
                return;
            }
            res.json({
                code: 400,
                msg: '登录失败，用户名或密码错误',
            });
        } catch ({ message }) {
            res.json({
                code: 500,
                msg: `服务端错误: ${ message }`,
            });
        }
    };
}

// 邮箱验证码登录
function byEmail(table) {
    return (req, res) => {
        res.json({ table });
    };
}

router.post('/admin/password', byPassword('admin'));
router.post('/user/password', byPassword('user'));
router.post('/admin/email', byEmail('admin'));
router.post('/user/email', byEmail('user'));

module.exports = router;
