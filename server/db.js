const { Pool } = require('pg');  //用来引入 PostgreSQL 的连接，Pool 是它提供的“连接池”对象“，这样多个请求可以重复使用连接，而不是每次都重新开一个
require('dotenv').config(); //加载 .env 文件里的配置项，把 .env 文件里写的内容，加载到 process.env 这个对象

const pool = new Pool({ //创建一个 数据库连接池（Pool 对象）
  connectionString: process.env.DATABASE_URL,  //用 .env 文件里读取的 DATABASE_URL 来连接数据库
  ssl: {  //ssl 是安全连接设置，Supabase 强制用 SSL，因为supabase是云端服务
    rejectUnauthorized: false, // 允许连上一个“不验证身份”的 SSL 数据库服务器，一般来说，如果数据库用的是“非官方、非受信的 SSL 证书，那么默认情况下 Node.js 会拒绝连接
  },
});

module.exports = pool; //把这个连接池导出去，让别的文件可以使用它