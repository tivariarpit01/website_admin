// controllers/exportController.js
import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import XLSX from "xlsx";
import { writeFileSync } from "fs";
import path from "path";

export const exportMessagesToExcel = asyncHandler(async (req, res) => {
  const messages = await Message.find({});

  const formattedMessages = messages.map((msg) => ({
    Name: msg.name,
    Email: msg.email,
    Subject: msg.subject,
    Message: msg.message,
    Date: msg.createdAt.toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedMessages);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

  const filePath = path.join("./exports", `messages-${Date.now()}.xlsx`);
  writeFileSync(filePath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to download file." });
    }
  });
});