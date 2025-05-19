## 功能说明

- 用户注册 & 登录（JWT 验证）
- 简历上传（限制 pdf/doc/docx）
- PDF 自动解析内容
- 用户可以编辑解析内容并确认保存
- HR 可查看所有简历并标记状态（待开发）

## 技术栈

- 前端：React + Axios
- 后端：Node.js + Express
- 文件上传：Multer
- 文档解析：pdf-parse
- 用户认证：JWT
- 数据库：PostgreSQL（预期）

## 本地运行方法

1. 克隆项目：
   ```bash
   git clone https://github.com/BaiyangChen/resume-upload-system.git
   cd resume-upload-system
   ```

## 安装依赖并启动 React 前端

npm install
npm start

## 启动后端

cd server
npm install
npm run dev

## TODO

    保存解析内容到数据库
    实现 HR 查看 + 状态管理页面
    加入注册/登录页面（已初步实现 JWT 验证）
    使用 Docker 进行部署优化

## Author

Baiyang Chen
Computer Science 本科
简历系统 by @BaiyangChen
