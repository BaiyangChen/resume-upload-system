const express = require('express'); //引入express，一个“框架”来帮我们处理网页请求
const cors = require('cors'); //导入 cors 模块，允许前端和后端沟通，本来是不允许前端从不同的地址跨域请求的
const pool = require('./db');
const app = express();  //创建一个实例，也就是一个小服务器
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

require('dotenv').config();

app.use(cors());  //允许前端来访问我
app.use(express.json());  //让后端能读懂前端发来的 JSON 格式的数据
app.use('/api/auth', authRoutes);//所有请求到/api/auth/...都会到authRoutes去处理
app.use('/api/resume', resumeRoutes);//所有前端请求到 /api/resume/... 都会到resumeRoutes去处理

//测试用的小网址，当别人打开 http://localhost:5000/ 时，req是请求，res是回应
app.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT NOW()'); // 查询当前时间
      res.send(`数据库连接成功，当前时间：${result.rows[0].now}`);
    } catch (err) {
      console.error('数据库连接失败：', err);
      res.status(500).send('数据库连接失败');
    }
  });

const PORT = 4000; //告诉服务器在port500运行
app.listen(PORT, () => {  //这个后端程序开始监听5000端口号，只要有人访问这个端口（发请求），这个程序就会处理
  console.log(`Server is running on port ${PORT}`);
});