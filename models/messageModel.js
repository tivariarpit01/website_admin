// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
const Message = mongoose.model("Message", messageSchema);
export default Message;
