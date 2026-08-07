# ☕ KopiText

KopiText is a simple web application that allows users to quickly save and share text through unique links (similar to Pastebin).

This project is divided into two main parts:
- **KopiTextBE** (Backend): A RESTful API that handles text storage and retrieval, built with **Go (Golang)**.
- **KopiTextUI** (Frontend): A responsive user interface built with **React, TypeScript, and Tailwind CSS**.

---

## 📁 Project Structure

```text
KopiText/
├── KopiTextBE/         # Backend API folder
│   └── main.go         # Go server entry point
└── KopiTextUI/         # Frontend UI folder
    ├── src/            # React source code (Pages, App.tsx, etc.)
    ├── package.json    # Node.js dependencies configuration
    └── ...
```

---

## ⚙️ Prerequisites

Before installing and running this project, ensure you have the following installed on your system:
- **[Go](https://go.dev/dl/)** (version 1.19 or newer)
- **[Node.js](https://nodejs.org/)** (version 18 or newer)
- A package manager such as **npm**, **yarn**, or **pnpm**.

---

## 🚀 Installation & Running

Since this project consists of a separate Backend and Frontend, you need to run them in two different terminals.

### 1. Running the Backend (KopiTextBE)
Open your first terminal and run the following commands:

```bash
# Navigate to the backend directory
cd KopiTextBE

# (Optional) Download module dependencies if any
go mod tidy

# Run the server
go run main.go
```
*The backend will run on `http://localhost:8080` by default.*

### 2. Running the Frontend (KopiTextUI)
Open your second terminal and run the following commands:

```bash
# Navigate to the frontend directory
cd KopiTextUI

# Install all React dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will run on `http://localhost:5173` by default (if using Vite).*

---

## 💡 Usage Guide

1. **Creating a New Text:**
   - Open your browser and navigate to the home page (e.g., `http://localhost:5173`).
   - Type or paste the text/code you want to share into the provided text area.
   - Click the **"Generate Link"** button.
2. **Sharing the Text:**
   - Once the button is clicked, the application will contact the backend to save the text and return a unique ID.
   - A unique link (e.g., `http://localhost:5173/abc12`) will appear below the button.
   - Click the **"Copy Link"** button to copy the URL to your clipboard.
3. **Reading the Text:**
   - Open the unique link in a new tab or share it with a friend.
   - The page will display the text in *read-only* mode.