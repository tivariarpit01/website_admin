// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },

  // New fields for your UI
  features: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
  cta: {
    text: { type: String, default: "Get Started" },
    link: { type: String, default: "/get-started" }
  },

  tags: { type: [String], default: [] }
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default Service;
