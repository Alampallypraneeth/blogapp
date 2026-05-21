# 📝 BlogApp: Premium Multi-Role Blogging Platform

BlogApp is a modern, high-performance, and feature-rich blogging platform built with a robust role-based architecture. Designed with a gorgeous aesthetic, it offers a seamless content-creation and reading experience. The application features three distinct user tiers—**Readers (Users)**, **Authors**, and **Administrators**—each equipped with dedicated spaces, actions, and features.

The stack utilizes **React 19**, **Vite 7**, and **Tailwind CSS v4** on the frontend, supported by a lightweight **Zustand** store. The backend runs on **Express 5 (Node.js)**, **MongoDB (Mongoose)**, and **Passport.js (Google OAuth)**, making this a state-of-the-art production-grade boilerplate for content systems.

---

## Key Platform Features

### 👤 Role-Based Portals & Workflows
*   **Reader (User)**: Browse and search articles, subscribe to premium tiers, purchase individual articles, post comments, customize themes (Light/Dark), and update profile pictures.
*   **Author**: Write, format, edit, publish, or delete articles. Authors can access a personal dashboard to monitor their articles' reach, read comments, and manage their portfolio.
*   **Administrator**: System-wide dashboard to review platform statistics, moderate and approve articles, manage users/authors, and enforce community standards.

### 🔐 Multi-Channel Secure Authentication
*   **Google OAuth 2.0 Integration**: Single-tap authentication powered by **Passport.js** for frictionless signup and login.
*   **JWT & HTTP-Only Cookies**: Secure, stateless authentication where the JSON Web Token is stored in a secure HTTP-Only cookie, protecting users from Cross-Site Scripting (XSS) attacks.
*   **Password Encryption**: Traditional email-and-password flow secured via **bcryptjs** for deep password hashing.
*   **Credential Recovery**: Forgot and reset password workflows utilizing **Nodemailer** to send tokenized, expiring reset links straight to the user's inbox.

### 🖼️Seamless Media Pipelines & Cloud Storage
*   **Cloudinary Integration**: Fully integrated media pipeline. Images uploaded by users or authors are processed by **Multer** and uploaded directly to Cloudinary's global Content Delivery Network (CDN) for optimized image delivery.

### Developer Sound Alert (Fun Custom Utility)
*   **The "Faaah" Crash Alarm**: A custom backend error listener. If the backend encounters an `uncaughtException`, an `unhandledRejection`, or an unexpected API error, it calls `playFaaah()` to immediately trigger a localized `faaah.mp3` sound alert on the host machine. This alerts developers of crashes instantly during local development!

---

## 🛠️ Complete Technology Stack

### Frontend Architecture
*   **React 19 & Vite 7**: The latest bleeding-edge React framework and build tool for ultra-fast Hot Module Replacement (HMR) and optimized build bundles.
*   **Tailwind CSS v4.0**: Styling is powered by Tailwind's next-gen compilation engine, providing a blazing-fast developer environment and rich utility styling.
*   **Zustand**: Clean, boilerplate-free state management with built-in persistence to maintain user sessions and UI states across page reloads.
*   **React Router v7**: Declarative role-based routing protecting private paths like `/author-profile`, `/user-profile`, and subscription views.
*   **React Hook Form**: Performant, clean form state validation for flawless login, registration, and article creation screens.
*   **Axios**: Configured client for handling HTTP requests, pre-set with credentials inclusion (`withCredentials: true`) to safely manage secure HTTP cookies.
*   **React Hot Toast**: Beautiful, non-intrusive micro-animations and status notifications for user interactions.

### Backend Architecture
*   **Node.js & Express 5**: Modern server runtime utilizing Express's latest v5 routing engine for streamlined async error handling.
*   **MongoDB & Mongoose**: Flexible, high-performance NoSQL database using schemas for Users, Articles, and Admin settings.
*   **Passport.js**: Robust authentication middleware facilitating both local and Google OAuth 2.0 login schemes.
*   **Nodemailer**: Clean SMTP configuration for automated platform emails (welcome emails, password resets).
*   **Multer & Cloudinary**: Streamlined multipart form parsing and high-performance media storage.
*   **Cookie Parser & CORS**: Rigorous configuration allowing cookies to be exchanged securely between the frontend client and the backend server.
*   **Play Sound**: Triggering audio clips directly from the Node server process upon errors or unhandled system rejections.

---

## 📂 Project Directory Structure

```text
Blogapp 2/
├── Backend/                    # Express.js Server
│   ├── APIs/                   # Express Routers
│   │   ├── AdminAPI.js         # Admin portal endpoints
│   │   ├── AuthorAPI.js        # Article author dashboard endpoints
│   │   ├── CommonAPI.js        # Shared auth, login, and profile utilities
│   │   └── userAPI.js          # Reader / general user endpoints
│   ├── Models/                 # Mongoose Database Models
│   │   ├── AdminModel.js       # Admin schema & stats trackers
│   │   ├── ArticleModel.js     # Article schema (comments, likes, media, premium locks)
│   │   └── UserModel.js        # User credentials, roles, and purchases
│   ├── assets/                 # Server-side static assets (e.g. faaah.mp3)
│   ├── config/                 # Cloudinary, Passport, and Multer configs
│   ├── middlewares/            # Role verifiers & JWT authorization checkers
│   ├── utils/                  # Nodemailer email configurations & sound players
│   ├── server.js               # Express application entrypoint
│   ├── package.json            # Backend packages and dev scripts
│   └── .env                    # (Ignored) Environment variables
│
├── Frontend/                   # React.js Client
│   ├── public/                 # HTML templates and SVG icons
│   ├── src/                    # React Source Files
│   │   ├── assets/             # Brand logos and images
│   │   ├── components/         # Highly modular React pages and widgets
│   │   │   ├── ArticleById.jsx # Full-length article page with premium wall
│   │   │   ├── ArticlesFeed.jsx# Paginated article board for readers
│   │   │   ├── AuthorProfile.jsx# Author statistics and quick-write portal
│   │   │   ├── ProtectedRoute.jsx# Strict role routing wall
│   │   │   └── WriteArticle.jsx# Interactive rich article editor
│   │   ├── store/              # Zustand global store files
│   │   │   ├── authStore.js    # Authentication persistence and auth API actions
│   │   │   └── themeStore.js   # Light/Dark UI theme manager
│   │   ├── styles/             # Shared styling hooks
│   │   ├── App.jsx             # React routing setup and layout wrapper
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # Application mount point
│   ├── vite.config.js          # Vite server and build config
│   ├── package.json            # Frontend packages and dev scripts
│   └── .gitignore              # Files excluded from git
│
└── README.md                   # Project documentation
```

---

##  Getting Started & Local Setup

To run both the backend and frontend servers on your local machine, follow these instructions.

### 1. Prerequisites
*   **Node.js**: Version `18.x` or higher installed.
*   **MongoDB**: An active MongoDB Atlas cluster or local MongoDB instance.
*   **Cloudinary Account**: For handling user image uploads.
*   **Google Developer Console Project**: (Optional) For enabling Google Sign-In credentials.

---

### 2. Backend Setup
1. Open your terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install all node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `Backend/` directory and populate it with the following environment variables:
   ```env
   PORT=4000
   DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogapp
   JWT_SECRET=your_jwt_secret_key_here
   SESSION_SECRET=your_session_secret_key_here
   
   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configurations (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Allowed Client
   FRONTEND_URL=http://localhost:5173
   ```
4. Run the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start up on `http://localhost:4000` with hot-reloading active via Nodemon.*

---

### 3. Frontend Setup
1. Open a new terminal window and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install the frontend packages:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The client dashboard will compile and launch on `http://localhost:5173`.*

---

## 🛡️ License

This application is released under the **ISC License**. You are free to customize, modify, and build upon this boilerplate for both commercial and personal endeavors. Enjoy blogging!
