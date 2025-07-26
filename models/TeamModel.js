// models/TeamModel.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    socials: {
      linkedin: { type: String },
      twitter: { type: String },
    },
  },
  { timestamps: true }
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
