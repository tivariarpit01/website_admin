// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  github: String,
  liveDemo: String,
  image: String,
});
const Project = mongoose.model("Project", projectSchema);
export default Project;
