import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import Project from "../models/projectModel.js";
import XLSX from "xlsx";
import fs, { writeFileSync, unlink } from "fs";
import path from "path";

// 📁 Ensure exports folder exists
const ensureExportsDir = () => {
  const exportsDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);
};

// 🔧 Utility to safely format date
const safeDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

// 📤 EXPORT MESSAGES TO EXCEL
export const exportMessagesToExcel = asyncHandler(async (req, res) => {
  ensureExportsDir();

  const messages = await Message.find({}).sort({ createdAt: -1 });

  const formattedMessages = messages.map((msg) => ({
    Name: msg.name || "N/A",
    Email: msg.email || "N/A",
    Subject: msg.subject || "N/A",
    Message: msg.message || "N/A",
    Date: safeDate(msg.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedMessages);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

  const fileName = `messages-${Date.now()}.xlsx`;
  const filePath = path.join("exports", fileName);

  writeFileSync(filePath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("❌ Message Export Error:", err.message);
      return res.status(500).json({ error: "Failed to download file." });
    }

    // 🧹 Cleanup
    unlink(filePath, () => {});
  });
});

// 📤 EXPORT PROJECTS TO EXCEL (with filters)
export const exportProjectsToExcel = asyncHandler(async (req, res) => {
  ensureExportsDir();

  const { status, from, to, search } = req.query;

  const filter = {};

  // 📅 Date filters
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  // 🔍 Search in title or description
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // ✅ Filter by status
  if (status) {
    filter.status = status;
  }

  const projects = await Project.find(filter).sort({ createdAt: -1 });

  const formattedProjects = projects.map((proj) => ({
    Title: proj.title || "N/A",
    Description: proj.description || "N/A",
    TechStack: Array.isArray(proj.techStack) ? proj.techStack.join(", ") : "N/A",
    GitHub: proj.github || "N/A",
    LiveDemo: proj.liveDemo || "N/A",
    Status: proj.status || "N/A",
    CreatedAt: safeDate(proj.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedProjects);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Projects");

  const fileName = `projects-${Date.now()}.xlsx`;
  const filePath = path.join("exports", fileName);

  writeFileSync(filePath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("❌ Project Export Error:", err.message);
      return res.status(500).json({ error: "Failed to download file." });
    }

    // 🧹 Cleanup
    unlink(filePath, () => {});
  });
});
