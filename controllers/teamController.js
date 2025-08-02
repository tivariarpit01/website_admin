import Team from "../models/TeamModel.js";
import fs from "fs";
import path from "path";

// 🧠 Helper to clean image path (convert backslashes to slashes)
const normalizePath = (filePath) => filePath.replace(/\\/g, "/");

// ✅ Create
export const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, linkedin, twitter } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and Role are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const image = normalizePath(req.file.path);

    const newMember = new Team({
      name,
      role,
      image,
      bio,
      socials: {
        linkedin: linkedin || "",
        twitter: twitter || "",
      },
    });

    await newMember.save();
    res.status(201).json({ message: "Team member created", member: newMember });
  } catch (err) {
    console.error("❌ Error creating team member:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Read All
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (err) {
    console.error("❌ Error fetching team members:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Read One
export const getSingleTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    res.status(200).json(member);
  } catch (err) {
    console.error("❌ Error fetching team member:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update
export const updateTeamMember = async (req, res) => {
  try {
    const { name, role, bio, linkedin, twitter } = req.body;

    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    if (req.file) {
      if (member.image && fs.existsSync(member.image)) {
        fs.unlinkSync(member.image);
      }
      member.image = normalizePath(req.file.path);
    }

    member.name = name || member.name;
    member.role = role || member.role;
    member.bio = bio || member.bio;
    member.socials.linkedin = linkedin || member.socials.linkedin;
    member.socials.twitter = twitter || member.socials.twitter;

    await member.save();
    res.status(200).json({ message: "Team member updated", member });
  } catch (err) {
    console.error("❌ Error updating team member:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    if (member.image && fs.existsSync(member.image)) {
      fs.unlinkSync(member.image);
    }

    await member.deleteOne();
    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    console.error("❌ Error deleting team member:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
