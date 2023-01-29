const loginRouter = require('./routes/login');
const { withCRUD } = require('./utils/routerFactory');
const app = require('../app');

app.use('/login', loginRouter);
app.use('/user', withCRUD('user'));
app.use('/admin', withCRUD('admin'));

module.exports = app;