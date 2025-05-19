//检查是否登录的中间件

const jwt = require('jsonwebtoken'); //引入jsonwebtoken库，用来之后对身份的验证
require('dotenv').config();  //加载 .env 文件中的环境变量

function verifyToken(req, res, next) { //创建 verifyToken 的函数，放在路由前面当“拦截器”  它会自动接收到 req（请求）、res（响应）、next（继续执行的回调）
  // 从请求头中拿到 Authorization
  const authHeader = req.headers['authorization']; //从req的header中取一个叫authorization的字段

  // 格式一般是 "Bearer xxxxxx"，我们要把它拆开
  const token = authHeader && authHeader.split(' ')[1]; //如果 authHeader 有值，就把它用空格分开，取第2段；如果没有值，就返回 undefined

  if (!token) {
    return res.status(401).json({ msg: 'can not access without login' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //用密钥 JWT_SECRET 验证这个 token, 如果 token 是合法的、没过期的，就返回解码后的内容
    req.user = decoded; // 把解析出来的用户信息存在 req.user 里
    next(); // 放行，继续执行上传逻辑
  } catch (err) {
    return res.status(403).json({ msg: 'Token invalid', error: err.message });
}
}

module.exports = verifyToken;