// models/teamModel.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  bio: String,
  socials: {
    linkedin: String,
    twitter: String,
  },
});

// Check if the model already exists, use it
const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
