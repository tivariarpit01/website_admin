// 🔐 --- MIDDLEWARES / ERROR HANDLING ---
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🧠 Custom MongoDB Connect
import connectDB from "./config/db.js";

// 📦 ROUTES
import blogRoutes from "./routes/blogRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/adminRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9002;

// 📂 Needed for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 💥 CORS + Security
app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
}));

// 📋 Logging & Body Parsing
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🖼️ Serve uploads folder statically (for image access)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛠️ API Routes
app.use("/api/admin", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);

// 🌐 Catch-All 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🚀 Start the Server After MongoDB Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  process.exit(1);
});

// 💣 Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});
