import Message from "../models/messageModel.js";
import Project from "../models/projectModel.js"; // ✅ Matches filename
import Service from "../models/Service.js";
import Team from "../models/TeamModel.js";
import Blog from "../models/BlogModel.js";

// Helper to get date N days ago
const getPastDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const getDashboardStats = async (req, res) => {
  try {
    const past7Days = getPastDate(7);

    const [
      totalMessages,
      recentMessages,
      totalProjects,
      workingProjects,
      pendingProjects,
      recentProjects,
      totalServices,
      totalTeam,
      totalBlogs
    ] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ date: { $gte: past7Days } }),

      Project.countDocuments(),
      Project.countDocuments({ status: "working" }),
      Project.countDocuments({ status: "pending" }),
      Project.countDocuments({ createdAt: { $gte: past7Days } }),

      Service.countDocuments(),
      Team.countDocuments(),
      Blog.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        messages: {
          total: totalMessages,
          last7Days: recentMessages
        },
        projects: {
          total: totalProjects,
          working: workingProjects,
          pending: pendingProjects,
          last7Days: recentProjects
        },
        services: totalServices,
        team: totalTeam,
        blogs: totalBlogs
      }
    });
  } catch (error) {
    console.error("❌ Dashboard Stats Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message
    });
  }
};
