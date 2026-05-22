# 🎨 BlogApp Frontend: React 19 & Vite 7 Client Dashboard

Welcome to the **BlogApp Frontend**! This is the user-facing layer of the blogging platform. It is a bleeding-edge, highly responsive, single-page application (SPA) built using **React 19**, compiled with **Vite 7**, styled with **Tailwind CSS v4.0**, and managed through lightweight, persistent **Zustand** state stores.

The client features role-based private routes, dynamic light/dark UI themes, custom media upload form structures, comment moderation boards, and interactive payment-subscription modals.

---

## 🎨 Technology Highlights

*   **React 19 & Vite 7**: The latest bleeding-edge React framework coupled with the fastest dev compiler for near-instant Hot Module Replacement (HMR).
*   **Tailwind CSS v4**: Dynamic utility-first layouts powered by Tailwind's next-gen engine, delivering premium transitions, dark-mode selectors, and clean glassmorphism patterns.
*   **Zustand (Persistent Stores)**: Standard React state replacement. Retains active user login objects, session credentials, and user theme selections inside LocalStorage across reloads.
*   **React Router v7**: Advanced declarative routing utilizing nested layout configurations and strict, role-protected wrappers.
*   **Axios Interceptors**: A preconfigured client set with `withCredentials: true` to seamlessly transmit secure HTTP-Only JWT tokens on every backend API request.
*   **React Hook Form**: Form inputs validated instantly with micro-animations and status banners handled by **React Hot Toast**.

---

## 📂 Frontend Directory Structure

Here is a map of the modular folder structure of the Frontend application:

```text
Frontend/
├── public/                 # Static assets, logos, index templates
├── src/                    # Source Directory
│   ├── assets/             # Branding icons, vector SVGs, default banners
│   ├── components/         # Highly modular React pages and widgets
│   │   ├── ArticleById.jsx # Detailed article content page with a premium purchase gate
│   │   ├── ArticlesFeed.jsx# Main grid feed showing articles with categories and likes
│   │   ├── AuthorArticles.jsx# Dedicated workspace listing author's own submissions
│   │   ├── AuthorProfile.jsx# Author analytics dashboard, comment totals, and settings
│   │   ├── ConfirmationModal.jsx# Reusable interactive prompt modal
│   │   ├── EditArticleForm.jsx# Interactive update page for editing article details
│   │   ├── ErrorBoundry.jsx# Catches unexpected runtime crashes gracefully
│   │   ├── Footer.jsx      # Sticky bottom platform footer with links
│   │   ├── ForgotPassword.jsx# Password recovery initiation screen
│   │   ├── Header.jsx      # Dynamic navigation navbar with role-based links
│   │   ├── Home.jsx        # Landing hero screen, featured articles, and testimonials
│   │   ├── Login.jsx       # Elegant login portal with Google Sign-in toggle
│   │   ├── Logo.jsx        # Customizable SVG branding logo
│   │   ├── ProtectedRoute.jsx# Strict guard block routing unauthorized users
│   │   ├── Register.jsx    # Signup portal with profile picture upload
│   │   ├── ResetPassword.jsx# Direct password reset token validation view
│   │   ├── RootLayout.jsx  # Wrap elements with consistent headers and footers
│   │   ├── SubscriptionModal.jsx# Subscription tier select options
│   │   ├── Unauthorize.jsx # Redirect fallback for forbidden paths
│   │   ├── UserProfile.jsx # Reader account dashboard, premium locks, and avatars
│   │   └── WriteArticle.jsx# Content creation suite with image attachments
│   │
│   ├── store/              # Global State Stores (Zustand)
│   │   ├── authStore.js    # Syncs user session states and handles all Auth API operations
│   │   └── themeStore.js   # Syncs Light / Dark mode toggles and browser styles
│   │
│   ├── styles/             # Modular css stylesheets
│   ├── App.jsx             # React Router v7 routes map and layout hierarchy
│   ├── index.css           # Tailwind CSS directives
│   └── main.jsx            # Mounting file boots the React DOM tree
│
├── vite.config.js          # Vite build options & development proxy setups
├── vercel.json             # Vercel deployment redirect instructions
└── package.json            # Client packages, scripts, and dev dependencies
```

---

## 🛠️ Main Application Workflows

### 🛡️ Declarative Role-Protected Routing
Private folders and profile pages are wrapped inside the [ProtectedRoute](file:///Users/alampallypraneeth/Desktop/Blogapp%202/Frontend/src/components/ProtectedRoute.jsx) component. It checks the Zustand `authStore` session status. If the role does not match, the user is redirected to the `Unauthorize` layout or `Login` instantly:
```jsx
<Route 
  path="/author-profile" 
  element={
    <ProtectedRoute allowedRoles={['AUTHOR']}>
      <AuthorProfile />
    </ProtectedRoute>
  } 
/>
```

### 🧠 Persistent Store Management (Zustand)
State is cleanly separated into reactive micro-stores:
1.  **[authStore](file:///Users/alampallypraneeth/Desktop/Blogapp%202/Frontend/src/store/authStore.js)**: Handles registration, login assertions, change password calls, profile picture updates, and purchases.
2.  **[themeStore](file:///Users/alampallypraneeth/Desktop/Blogapp%202/Frontend/src/store/themeStore.js)**: Tracks light/dark mode status and applies the `.dark` class list directly onto the HTML tag element, maintaining styling configurations across refreshes.

### 💳 Content Subscription Gate & Purchases
Articles flagged with `isPremium: true` in the DB trigger the [SubscriptionModal](file:///Users/alampallypraneeth/Desktop/Blogapp%202/Frontend/src/components/SubscriptionModal.jsx) within the [ArticleById](file:///Users/alampallypraneeth/Desktop/Blogapp%202/Frontend/src/components/ArticleById.jsx) view. Unless the user has an active premium subscription role or has purchased that individual article, the platform displays an overlay blur and prompts the user to unlock the content.

---

## ⚙️ Getting Started & Scripts

Navigate to the `Frontend` directory, install packages, and spin up the developer server:

```bash
# 1. Access directory
cd Frontend

# 2. Install package node modules
npm install

# 3. Spin up Vite local developer engine (Hot Module Replacement)
npm run dev

# 4. Compile and bundle resources into static distribution folder (dist/)
npm run build

# 5. Preview local compiled production build
npm run preview

# 6. Run ESLint review on files
npm run lint
```

The client dashboard compiles and launches on **`http://localhost:5173`**. You can open it in your browser to start blogging!
