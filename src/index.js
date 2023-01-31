const app = require('../app');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const errorCatch = require('./utils/ErrorCatch');

app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
// token失效错误处理
app.use(errorCatch);

module.exports = app;