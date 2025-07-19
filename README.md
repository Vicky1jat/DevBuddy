# 🤖 DevBuddy – Your AI Coding Assistant

DevBuddy is a modern, full-stack AI-powered assistant built to help developers understand code, solve DSA problems, and run code in multiple languages—all in one elegant interface.

### 🖼 UI Preview
| Hero | Editor & Interaction | Footer |
|------|----------------------|--------|
| ![Hero](asset/hero.png) | ![Editor](asset/middle.png) | ![Footer](asset/footer.png) |


---

## 🚀 Features

- 💬 Ask coding questions and get GPT-powered answers.
- 🧠 Solve DSA problems with AI-guided help.
- 📊 Instant complexity analysis.
- 💻 In-browser code compiler with support for:
  - C++
  - Python
  - Java
  - JavaScript
  - C

---

## 🛠 Tech Stack

| Frontend  | Backend   | APIs & Tools         | Deployment     |
|-----------|-----------|----------------------|----------------|
| Vite + React | Express.js (Node.js) | OpenRouter (GPT), Judge0 (Code Execution) | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure
DevBuddy/
├── client/ # Frontend - Vite + React
│ ├── public/
│ │ └── favicon.png
│ └── src/
│ ├── components/
│ ├── pages/
│ │ └── Home.jsx
│ └── main.jsx
│ └── App.jsx
├── server/ # Backend - Node.js + Express
│ ├── controllers/
│ │ └── devbuddyController.js
│ │ └── judge0Controller.js
│ ├── routes/
│ │ └── index.js
│ └── app.js
└── README.md

## 🔧 Setup & Installation

      1. Clone the Repository
      
        ```bash
        git clone https://github.com/Vicky1jat/DevBuddy.git
        cd DevBuddy
      
      
      2.⚙️ Configure Environment Variables
            Create a .env file in both /client and /server directories:
            
            📁 client/.env
               VITE_API_URL=https://your-backend-url.onrender.com/api
            📁 server/.env
               OPENROUTER_API_KEY=your_openrouter_api_key
               JUDGE0_API=https://judge0-api-url
               PORT=10000

       3. 🧪Install Dependencies
             cd server
             npm install
             cd client
             npm install

🧪 Running Locally
   cd server
   npm start
   cd client
   npm run dev
   

🌍 Live Demo
   🔗 Frontend: https://dev-buddy-murex.vercel.app
   🔗 Backend: https://devbuddy-backend-cxgo.onrender.com
   
🙌 Credits
   🤖 GPT responses powered by OpenRouter API
   💻 Code execution via Judge0
   🌐 Hosting via Render and Vercel
