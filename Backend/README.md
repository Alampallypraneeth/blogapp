# 🗄️ BlogApp Backend: REST API Server & Database Schema

Welcome to the **BlogApp Backend**! This is the engine of the blogging platform, powering everything from role-based authentication and secure JSON Web Token cookie distribution to multimedia image uploading pipelines, Mongoose models, and transactional subscription gates.

---

## 🛠️ Technology Highlights

*   **Express 5 (Node.js)**: Utilizes bleeding-edge Express v5 router engines for enhanced, native support for async middleware error bubbles.
*   **Mongoose & MongoDB**: Fully validated, structured database schemas separating admin configurations, user tier access, and nested comment chains.
*   **Passport.js & JWT Security**: Triple-guard authentication system employing Passport configurations for OAuth login workflows, plus a secure, stateless HTTP-Only JSON Web Token cookie configuration.
*   **Multer & Cloudinary Storage**: Best-effort streaming media pipelines. Uploaded multipart/form-data images are parsed in-memory, uploaded to Cloudinary, and cleaned up locally immediately.
*   **The "Faaah" Sound Alarm**: Custom host-system terminal listener. If an unhandled process exception arises, the server immediately triggers `playFaaah()` using your machine's audio card to alert developers of a code break during testing.

---

## 📂 Backend Directory Structure

Here is a detailed map of how the backend directory is arranged:

```text
Backend/
├── APIs/                   # Express.js Routers (Core API routes)
│   ├── AdminAPI.js         # Administration & user management endpoints
│   ├── AuthorAPI.js        # Article author dashboard, publishing & gallery endpoints
│   ├── CommonAPI.js        # Universal auth, logins, tokens, and password reset endpoints
│   └── userAPI.js          # Reader/General user, feeds, commenting, and purchase endpoints
│
├── Models/                 # Mongoose Database Schemas & Models
│   ├── AdminModel.js       # Admin configuration settings and logs
│   ├── ArticleModel.js     # Article structures, nested comments schema, likes, and image galleries
│   └── UserModel.js        # User profile, password hashes, tier roles, and purchase collections
│
├── assets/                 # Server-side static assets
│   └── faaah.mp3           # Developer auditory alert sound clip
│
├── config/                 # Third-party credentials config wrappers
│   ├── cloudinary.js       # Cloudinary SDK init
│   ├── cloudinaryUpload.js # Cloudinary Buffer pipeline upload stream utility
│   ├── db.js               # Mongoose MongoDB connection event loop
│   └── multer.js           # Multer in-memory storage handler
│
├── middlewares/            # Request Interceptors
│   ├── checkauthor.js      # Restricts requests exclusively to registered Authors
│   └── verifyTokens.js     # Parses and verifies HTTP-Only Cookies containing JWT payloads
│
├── services/               # Reusable platform workflows
│   └── authService.js      # User registration hashing, salt generation, and login assertions
│
├── utils/                  # Core standalone tools
│   ├── emailService.js     # Nodemailer SMTP transporter template sending triggers
│   └── playSound.js        # Node child_process trigger to play physical audio alarms
│
├── server.js               # Application Entry Point & Express initializations
└── package.json            # NPM Scripts, dependencies, and packages
```

---

## 🔌 API Route Reference & Endpoint Maps

The following tables show a complete list of endpoints implemented in the BlogApp server:

### 🌐 Common API Endpoints (`/common-api`)
*Used by all user tiers (Admin, Author, Reader) for session management.*

| Route Path | Method | Headers/Auth | Request Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | `POST` | None | `{ email, password }` | Standard authentication. Distributes a secure HTTP-Only cookie named `token`. |
| `/check-auth`| `GET` | Cookie `token` (Any Role) | None | Validates token and returns current user details minus hash. |
| `/logout` | `GET` | Cookie `token` (Any Role) | None | Clears the HTTP-Only JWT cookie. |
| `/change-password` | `PUT` | Cookie `token` (Any Role) | `{ currentPassword, newPassword }` | Matches old password and securely updates the user hash. |
| `/update-profile-pic` | `PUT` | Cookie `token` (Any Role) | `multipart/form-data` with key `profilePic` | Uploads profile pic to Cloudinary, updates user model database document, and returns payload. |
| `/direct-reset` | `POST` | None | `{ email, password }` | Reset a password directly without email tokens (for rapid developer prototyping). |

---

### 📖 Reader / General User Endpoints (`/user-api`)
*Handles the general reader workflows, article views, purchase loops, and comment tracking.*

| Route Path | Method | Headers/Auth | Request Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/users` | `POST` | None (Optional profile image upload) | `multipart/form-data` containing registration data | Registers a standard reader or author user, hashes password, uploads profile picture. |
| `/login` | `POST` | None | `{ email, password }` | Login endpoint for user feeds. |
| `/articles` | `GET` | Cookie `token` (Any Role) | None | Fetches all active, published articles sorted newest first. |
| `/article/:id` | `GET` | Cookie `token` (Any Role) | None | Fetches single article, increments the view count by `1`, and populates nested comment user details. |
| `/articles` | `PUT` | Cookie `token` (Any Role) | `{ user, articleId, comment }` | Appends a comment object into the nested comments array of the targeted article. |
| `/articles/:articleId/comments/:commentId` | `PATCH` | Cookie `token` (Any Role) | None | Removes a comment from the article's comments array (universal moderation for testing). |
| `/purchase` | `POST` | Cookie `token` (Any Role) | `{ articleId }` | Records a premium article purchase on the user profile to unlock premium views. |

---

### ✍️ Author-Specific Endpoints (`/author-api`)
*Secured endpoints allowing registered Authors to create, edit, delete, and add images to their articles.*

| Route Path | Method | Headers/Auth | Request Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/users` | `POST` | `multipart/form-data` profile picture | Registration Form | Registers a new Author user tier directly. |
| `/login` | `POST` | None | `{ email, password }` | Login for Authors. |
| `/articles` | `POST` | Cookie `token` (`AUTHOR` role verification) | `multipart/form-data` with cover `image` | Creates a new article associated with the logged-in Author. |
| `/articles` | `GET` | Cookie `token` (`AUTHOR` role verification) | None | Fetches all articles created by the logged-in Author. |
| `/articles/:id`| `PUT` | Cookie `token` (`AUTHOR` role verification) | `multipart/form-data` with key `image` | Updates title, category, content, premium flags, and cover-art of the specified article. |
| `/articles/:id/images` | `POST` | Cookie `token` (`AUTHOR` role) | `multipart/form-data` with key `image` | Uploads an image and appends it to the article's gallery array. |
| `/articles/:id/images/:index` | `DELETE`| Cookie `token` (`AUTHOR` role) | None | Removes the specified image by its index from the article's gallery array. |
| `/articles/:id/images/:index` | `PUT` | Cookie `token` (`AUTHOR` role) | `multipart/form-data` with key `image` | Replaces a gallery image at the specified index with a new uploaded image. |
| `/articles/:id/status` | `PATCH`| Cookie `token` (`AUTHOR` role verification) | `{ isArticleActive }` | Performs a soft-delete (inactive) or restore (active) toggle on the specified article. |

---

### 🛡️ Admin-Specific Endpoints (`/admin-api`)
*Secured endpoints restricted to platform Administrators.*

| Route Path | Method | Headers/Auth | Request Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/users/:usersId` | `GET` (Block) | Cookie `token` (`ADMIN` role verification) | None | Performs a block operation by setting the user's `isActive` flag to `false`. |
| `/users/:usersId` | `GET` (Unblock) | Cookie `token` (`ADMIN` role verification) | None | Performs an unblock operation by setting the user's `isActive` flag to `true`. |

---

## ⚙️ Environment Variables Template

Create a `.env` file in the `Backend/` folder and insert the following options, replacing placeholders with your keys:

```env
PORT=4000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogapp
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Email Configurations (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Google OAuth Credentials (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS White-List Client
FRONTEND_URL=http://localhost:5173
```

---

## 🕹️ Getting Started & Scripts

Navigate to the `Backend` folder, install the packages, and run the server:

```bash
# 1. Access directory
cd Backend

# 2. Install dependencies
npm install

# 3. Spin up local development server with nodemon (auto reload)
npm run dev

# 4. Spin up standard node server
npm start
```

Your API backend will launch on `http://localhost:4000`. You can monitor log outputs directly in your terminal process window!
