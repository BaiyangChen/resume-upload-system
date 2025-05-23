//引入各种模块
const express = require('express');
const multer = require('multer'); //处理上传文件，自动把文件保存到本地硬盘，取名
const path = require('path'); //处理文件路径后缀等
const verifyToken = require('../middlewares/authMiddleware'); // “JWT 权限中间件” 判断用户有没有登陆
const pdfParse = require('pdf-parse');
const fs = require('fs'); //操作文件系统 比如创建文件夹
const router = express.Router(); //创建一个新的路由对象
const pool = require('../db');

// 设置上传文件夹和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/'; //设置一个目标文件夹用来存文件
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);  //检查文件夹是否存在，不存在就创建
    cb(null, dir);  //没有错误，存到uploads/
  },
  filename: function (req, file, cb) { //设置上传文件的文件名
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9); //生成一个唯一的名字，当前时间（毫秒）+ 一个从0-十亿的随机数
    cb(null, uniqueName + path.extname(file.originalname)); //用唯一名+原扩展名，作为最终文件名
  },
});

// 限制上传大小、文件类型
const upload = multer({
  storage, //上面定义的保存路径和命名规则
  limits: { fileSize: 5 * 1024 * 1024 }, // 最大5MB
  fileFilter: function (req, file, cb) { //检查文件类型
    const filetypes = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase(); //从文件名中或许扩展名，比如docx，全部变成小写
    if (filetypes.test(ext)) { //检查是不是运行的扩展名
      return cb(null, true);
    }
    cb(new Error('only accept PDF / DOC / DOCX '));
  },
});

// 上传简历接口（受保护）
router.post('/upload', verifyToken, upload.single('resume'), async(req, res) => { //两个拦截器，判断是否登陆，传入一个单文件，字段名是resume，然后才执行最终逻辑
    try {
    const filePath = req.file.path; //文件在服务器上的路径

    // 读取文件并解析 PDF
    const dataBuffer = fs.readFileSync(filePath); //用fs的readFileSync把文件内容用二进制数据Buffer读出来
    const data = await pdfParse(dataBuffer); //调用 pdf-parse 库来解析 PDF 文件内容，自动把Buffer转成能用的数据对象 {numpages: 1, info: { Title: '', Author: '', ... }, text: "张三\n电话：13888\n技能：Python, JavaScript"}

    const text = data.text; // 在data中提取的纯文字内容
    
    res.json({
    msg: 'upload and analysis success!',
    filename: req.file.filename,
    uploadedBy: req.user.userId,
    content: text
    });
    } catch (err) {
        console.error('Resume Analysis Fail', err.message);
        res.status(500).json({ msg: 'Upload Success, Analysis Fail', error: err.message });
    }
});

//保存简历文本到数据库的接口
router.post('/save', verifyToken, async (req, res) => {
  const { filename, content, name, email, phone, skills, education, experience } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ msg: 'Resume content empty' });
  }

  try {
    await pool.query(
      'INSERT INTO resumes (user_id, filename, raw_text, name, email, phone, education, experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [userId, filename, content, name, email, phone, skills, education, experience]
    );

    res.json({ msg: 'Resume save success' });
  } catch (err) {
    console.error('Resume Save Fail', err.message);
    res.status(500).json({ msg: 'Saving Fail on Server' });
  }
});

//查看简历，只有hr可以
router.get('/all', verifyToken, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ msg: 'Only HR can view all resumes' });
  }

  try {
    const result = await pool.query(`
      SELECT id, name, email, phone, education, experience, skills, status, created_at
      FROM resumes
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Query Fail' });
  }
});

//修改简历状态
router.put('/status/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ msg: 'Only HR can modify resume status' });
  }

  const resumeId = req.params.id;
  const { status } = req.body;

  try {
    await pool.query('UPDATE resumes SET status = $1 WHERE id = $2', [status, resumeId]);
    res.json({ msg: 'Update Resume Status Success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Update Resume Status Fail' });
  }
});

module.exports = router;