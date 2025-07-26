// controllers/teamController.js
import Team from "../models/TeamModel";

export const createTeamMember = async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const members = await Team.find();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};