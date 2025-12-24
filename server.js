// 🔐 --- MIDDLEWARES / ERROR HANDLING ---
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🧠 MongoDB Connect
import connectDB from "./config/db.js";

// 📦 Routes
import blogRoutes from "./routes/blogRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// 📂 Needed for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Setup — allow frontend to connect
app.use(
  cors({
    origin: [
      "https://www.sutraiq.com",
      "http://localhost:9002",
    
    ],
    credentials: true, // ✅ cookies / headers ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
;




// 🛡️ Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later."
}));

// 🧠 Body parsers & logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 🖼️ Serve static images from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔗 API routes
app.use("/api/admin", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);


// 🔚 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🚀 Start server after DB connect
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server live at: http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err.message);
  process.exit(1);
});

// 💣 Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});
