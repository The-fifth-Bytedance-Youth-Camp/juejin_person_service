const express = require('express');
const loginRouter = require('./routes/login');
const { withCRUD } = require('./utils/routerFactory');
const app = express();
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const key = 'hello';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//验证token是否过期并规定那些路由不需要验证
app.use(expressJwt.expressjwt({
  secret: key,
  algorithms: [ 'HS256' ],
}).unless({
  path: [ '/login' ],  //不需要验证的接口名称
}));

app.use('/login', loginRouter);
app.use('/user', withCRUD('user'));
app.use('/admin', withCRUD('admin'));

// 全局的错误处理——token失效返回信息,通过失败处理
app.use((err, req, res) => {
	// 由 token 解析失败导致的
	if (err.name === 'UnauthorizedError') {
		res.json({
			status: 401,
			message: '无效的token',
		});
	}
});
  
module.exports = app;