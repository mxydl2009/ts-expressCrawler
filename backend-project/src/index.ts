import express from 'express';
import './controller/loginController';
import './controller/crawlerController';
import router from './router';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session'; // 将会话数据存储在客户端的cookie上

const app = express(); // 创建一个express应用

app.use(bodyParser.urlencoded({ extended: false }));
// 通过应用cookie-session中间件，将自动给req附属一个session属性来记录这次会话
app.use(
  cookieSession({
    name: 'logined', // 存储的cookie名
    keys: ['I am the king', 'I am not the king'], // 用于加密和解密的key，总是用key[0]加密(不管key[0]是什么，只要被加密的内容不变，加密后都一样)，用其他key解密
    maxAge: 24 * 60 * 60 * 1000
  })
);

app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});

// 问题1： express库的类型声明文件.d.ts， 类型描述不准确
// 解答1： 可以将要用到的类型对原来的类型进行继承扩展，用新的类型来定义变量类型
// 问题2： 当使用中间件的时候，对req, res进行解析后，对req和res的类型也需要修改
// 解答2： 可以自定义类型声明文件，typescript提供类型合并机制，
//         将Express官方的类型声明文件和自定义的类型声明文件合并，把相同名字的类型合并为一个类型
//         合并后可能需要重启编辑器，才不会报错
