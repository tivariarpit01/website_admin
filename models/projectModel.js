import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    techStack: {
      type: [String], // ["React", "Node", "MongoDB"]
      default: [],
    },
    github: {
      type: String,
      trim: true,
    },
    liveDemo: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // file path or URL
    },
    status: {
      type: String,
      enum: ["pending", "working", "completed"],
      default: "pending",
    },
  },
  { timestamps: true } // 🔥 adds createdAt & updatedAt
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
