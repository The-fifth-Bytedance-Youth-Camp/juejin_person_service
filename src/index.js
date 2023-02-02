const app = require('../app');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const uploadRouter = require('./routes/upload');
const errorCatch = require('./utils/ErrorCatch');

app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/upload', uploadRouter);

// 错误处理
app.use(errorCatch);

module.exports = app;