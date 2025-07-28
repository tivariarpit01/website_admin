import Team from "../models/TeamModel.js";
import path from "path";

// 🔥 CREATE
export const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, linkedin, twitter } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "Name and Role are required." });
    }

    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const newMember = await Team.create({
      name,
      role,
      bio,
      image,
      socials: {
        linkedin: linkedin || "",
        twitter: twitter || "",
      },
    });

    res.status(201).json(newMember);
  } catch (err) {
    console.error("❌ Create error:", err.message);
    res.status(500).json({ error: "Failed to create team member." });
  }
};

// 📥 GET ALL
export const getTeamMembers = async (req, res) => {
  try {
    const members = await Team.find();
    res.status(200).json(members);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch team members." });
  }
};

// ✏️ UPDATE
export const updateTeamMember = async (req, res) => {
  try {
    const { name, role, bio, linkedin, twitter } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(role && { role }),
      ...(bio && { bio }),
      socials: {
        linkedin: linkedin || "",
        twitter: twitter || "",
      },
    };

    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/");
    }

    const updated = await Team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Team member not found." });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ error: "Failed to update team member." });
  }
};

// ❌ DELETE
export const deleteTeamMember = async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Team member not found." });
    }

    res.status(200).json({ message: "Team member deleted successfully." });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete team member." });
  }
};
