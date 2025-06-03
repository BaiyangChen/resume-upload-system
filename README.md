## Features

- User registration & login (with JWT authentication)
- Resume upload (supports PDF, DOC, DOCX formats)
- Automatic resume content extraction using LLM models (DeepSeek, LLaMA)
- Intelligent JSON parsing with error handling for LLM outputs
- Users can review and edit parsed resume fields before saving
- HR can view all resumes and update application status (in progress)
- Modular full-stack architecture

## Tech Stack

- Frontend: React + Axios
- Backend: Node.js + Express
- File Upload: Multer
- Document Parsing: pdf-parse
- AI Models: DeepSeek R1, LLaMA3 (via Ollama)
- Data Cleaning: Regex-based JSON extraction
- Authentication: JWT
- Database: PostgreSQL

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

Try to use AI to extract keyword in resume - done

Improve deployment using Docker

## Author

Hi! I'm Baiyang Chen, a Computer Science student based in Montreal, passionate about full-stack development and AI integration.

I built this project to practice:

- Full-stack architecture (React + Node.js + PostgreSQL)
- Authentication with JWT
- Resume parsing with LLM models and real-world AI output handling
- Frontend-backend integration & API error handling

Feel free to check out more of my work or connect with me:

GitHub: https://github.com/baiyangchen

LinkedIn: https://linkedin.com/in/baiyang-chen
