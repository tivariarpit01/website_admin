import Message from "../models/messageModel.js";



export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const newMessage = await Message.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("❌ Create Message Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


// 📥 GET All Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 }); // latest first
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("❌ Fetch Messages Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ❌ DELETE a Message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Message not found." });
    }

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Message Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
