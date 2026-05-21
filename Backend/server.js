import "dotenv/config";
import exp from "express";
import { connect } from "mongoose";
import { userRoute } from "./APIs/userAPI.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminAPI.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { commonRouter } from "./APIs/CommonAPI.js";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import jwt from "jsonwebtoken";
import { playFaaah } from "./utils/playSound.js";

const app = exp();

// Catch sync crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  playFaaah();
});

// Catch async crashes
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  playFaaah();
});

// Detect abnormal exit
process.on("exit", (code) => {
  if (code !== 0) {
    playFaaah();
  }
});


// ================= CORS =================
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (e.g. curl, mobile apps)
      if (!origin) return cb(null, true);

      // allow explicit configured origins
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // allow matching hostname of FRONTEND_URL (handles missing https:// protocols, trailing slashes, etc.)
      try {
        const parsed = new URL(origin);
        if (process.env.FRONTEND_URL) {
          let frontendHost = process.env.FRONTEND_URL;
          if (!frontendHost.startsWith("http://") && !frontendHost.startsWith("https://")) {
            frontendHost = "https://" + frontendHost;
          }
          const parsedFrontend = new URL(frontendHost);
          if (parsed.hostname === parsedFrontend.hostname) {
            return cb(null, true);
          }
        }
      } catch (e) {
        // ignore parse errors
      }

      // allow any localhost port (vite may pick different ports like 5173/5174/5175)
      try {
        const parsed = new URL(origin);
        if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
          return cb(null, true);
        }
      } catch (e) {
        // ignore parse errors
      }

      return cb(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

// ================= BODY PARSER =================
app.use(exp.json());

// ================= COOKIE PARSER =================
app.use(cookieParser());

// ================= SESSION & PASSPORT =================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "blogappsessionsecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ================= GOOGLE AUTH ROUTES =================
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    // Successful authentication
    const user = req.user;
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    // Redirect back to frontend based on role
    if (user.role === "AUTHOR") {
      res.redirect("http://localhost:5173/author-profile");
    } else {
      res.redirect("http://localhost:5173/user-profile");
    }
  }
);

// ================= CONNECT APIs =================
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);


// ================= CONNECT DB =================
const connectDB = async () => {
  try {

    await connect(process.env.DB_URL);

    console.log("DB connection success");

    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server started on port ${process.env.PORT || 4000}`);
    });

  } catch (err) {

    console.log("Error in DB connection", err);

  }
};

connectDB();


// ================= INVALID PATH =================
app.use((req, res) => {
  res.status(404).json({
    message: `${req.url} is an invalid path`
  });
});


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // 🔥 ADD THIS LINE
  playFaaah();

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message
    });
  }

  res.status(500).json({
    message: "error occurred",
    error: "Server side error"
  });

});
