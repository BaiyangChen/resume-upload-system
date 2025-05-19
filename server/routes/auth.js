// server/routes/auth.js
const express = require('express'); // 引入 express 框架
const bcrypt = require('bcrypt'); // 用来加密密码
const jwt = require('jsonwebtoken');// 用来生成登录 token
const pool = require('../db'); // 数据库连接（pg池子）

const router = express.Router(); //Express 的路由系统，最后会 module.exports = router 导出去，也就是把这这些功能拿出去给其他文件使用

// 注册接口
router.post('/register', async (req, res) => { //监听用户发来的请求 如果是/register请求，就做以下动作
  const { email, password, role } = req.body; //把这三个字段从请求体中解构出来

  try {
    // 1. 查用户是否已存在
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]); //去数据库中看一下有没有这个email的用户，等待查询结束再执行下面的命令
    if (existingUser.rows.length > 0) { //existingUser会返回一个row，就是查到的这个email的用户的信息，里面包含密码和role和email，如果已经存在那length就是1，不能出现多个row，因为这样证明有多个同样email的用户存在
      return res.status(400).json({ msg: 'User Exist' });
    }

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10); //用bcrypt.hash()把明文密码加密，这样数据库中就不会出现真实密码，都是加密之后的密码

    // 3. 插入数据库
    await pool.query( //往user表添加数据，四个字段分别是：id、email、password、role，然后他们的值分别是自动生成id, 用户提供的邮箱$1, 加密后的密码$2, 用户角色$3
      'INSERT INTO users (id, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3)',
      [email, hashedPassword, role]
    );

    res.json({ msg: '注册成功' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器出错');
  }
});


// 登录接口
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. 查找用户
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) {
        return res.status(400).json({ msg: 'User not Exist' });
      }
  
      // 2. 验证密码
      const isMatch = await bcrypt.compare(password, user.rows[0].password); //数据库中的密码都是加密过的，所以不能直接拿来跟password比较，需要用bcrypt.compare来比较，它会用相同的加密方法把输入的密码加工一下，看看是不是跟数据库中的加密密码一样
      if (!isMatch) {
        return res.status(400).json({ msg: 'password incorrect' });
      }
  
      // 3. 生成 JWT
      const payload = { //把user id和user role装进payload，之后会把payload的内容装进token
        userId: user.rows[0].id,
        role: user.rows[0].role,
      };
      //用用户的信息（payload），配上密钥（JWT_SECRET），做出一张【登录通行证】（token），这张通行证只能用 2 小时
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  
      res.json({ token, role: user.rows[0].role });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;