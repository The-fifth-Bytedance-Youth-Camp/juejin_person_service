const express = require('express');
const router = express();
const database = require('../utils/database');
const jwt = require('jsonwebtoken');
const secretKey = 'hello';
const md5 = require('md5');


//用户登录
router.post('/',async(req,res)=>{
    const { id,password } = req.body;
    if(!id||!password){
        res.json({
            code:401,
            msg: '用户名与密码为必传参数',
        });
        return;
    }
    //判断该id是否属于管理员
    try{
        const isAdmin = await database.select('*')
            .from('admin')
            .where('id', id)
            .queryRow();
        const ans = md5(password)===isAdmin.password?true:false;
        //若属于管理员
        if(ans){
            //生成token
            const tokenStr = jwt.sign({ userid: id },secretKey,{ expiresIn: '30days' });
            res.json({
                code:200,
                msg:'登录成功',
                token: tokenStr,
            });
        }else{
            res.json({
                code:400,
                msg: '登录失败，用户名或密码错误',
            });
        }
    }catch(error){
        console.log('判断该用户是否属于普通用户');
    }
    
    //判断该用户是否是普通用户
    try{
        const isUser = await database.select('*')
            .from('user')
            .where('id', id)
            .queryRow();
        const ans = md5(password)===isUser.password?true:false;
        if(ans){
            const tokenStr = jwt.sign({ userid: id },secretKey,{ expiresIn: '3h' });
            res.json({
                code:200,
                msg: '登录成功',
                token: tokenStr,
            });
        }else{
            res.json({
                code:400,
                msg: '登录失败，用户名或密码错误',
            });
        }
    }catch(err){
        console.log(err);
    }   
});
 
module.exports = router;