// controllers/dashboardController.js

import Message from "../models/messageModel.js";
import Project from "../models/projectModel.js";
import Service from "../models/Service.js";
import Team from "../models/TeamModel.js";
import Blog from "../models/blogModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalTeam = await Team.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        messages: totalMessages,
        projects: totalProjects,
        services: totalServices,
        team: totalTeam,
        blogs: totalBlogs,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

