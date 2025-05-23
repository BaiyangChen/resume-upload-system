## Features

- User registration & login (with JWT authentication)
- Resume upload (supports PDF, DOC, DOCX formats)
- Automatic content extraction from PDF resumes
- Users can edit and confirm parsed resume content
- HR can view all resumes and update application status (in progress)

## Tech Stack

- Frontend: React + Axios
- Backend: Node.js + Express
- File Upload: Multer
- Document Parsing: pdf-parse
- Authentication: JWT
- Database: PostgreSQL _(planned)_

## Getting Started (Local Development)

1. Clone the project:

   ```bash
   git clone https://github.com/BaiyangChen/resume-upload-system.git
   cd resume-upload-system

   ```

## Install dependencies and start the React frontend:

npm install
npm start

## Start the backend server:

cd server
npm install
npm run dev

## TODO

Save parsed resume content to the database - done

Build HR dashboard with application status management - done

Complete registration/login pages (JWT auth already integrated) - done

Try to use AI to extract keyword in resume

Improve deployment using Docker

## Author

Hi! I'm Baiyang Chen, a Computer Science student based in Montreal, passionate about full-stack development.
I built this project to deepen my understanding of backend APIs, frontend integration, authentication, and cloud deployment using modern tools.

Feel free to check out more of my work or connect with me:

GitHub: https://github.com/baiyangchen

LinkedIn: https://linkedin.com/in/baiyang-chen
