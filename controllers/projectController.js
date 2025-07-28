import Project from "../models/ProjectModel.js";

// 📦 CREATE Project
export const createProject = async (req, res) => {
  try {
    const { title, description, github, liveDemo, techStack, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const newProject = await Project.create({
      title: title.trim(),
      description,
      github: github?.trim(),
      liveDemo: liveDemo?.trim(),
      techStack: techStack ? JSON.parse(techStack) : [],
      image,
      status: status || "pending", // default handled in model too
    });

    res.status(201).json({ success: true, message: "✅ Project created", data: newProject });
  } catch (err) {
    console.error("❌ Project Create Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📥 GET All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error("❌ Get Projects Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✏️ UPDATE Project
export const updateProject = async (req, res) => {
  try {
    const { title, description, github, liveDemo, techStack, status } = req.body;

    const updatedData = {
      ...(title && { title: title.trim() }),
      ...(description && { description }),
      ...(github && { github: github.trim() }),
      ...(liveDemo && { liveDemo: liveDemo.trim() }),
      ...(status && { status }),
      ...(techStack && {
        techStack: Array.isArray(techStack)
          ? techStack
          : JSON.parse(techStack),
      }),
    };

    if (req.file) {
      updatedData.image = req.file.path.replace(/\\/g, "/");
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    res.status(200).json({ success: true, message: "✅ Project updated", data: updatedProject });
  } catch (err) {
    console.error("❌ Project Update Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ❌ DELETE Project
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    res.status(200).json({ success: true, message: "🗑️ Project deleted successfully" });
  } catch (err) {
    console.error("❌ Project Delete Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
