import express from "express";
import { createTeamMember, getAllTeamMembers, deleteTeamMember, updateTeamMember } from "../controllers/teamController.js";
import { teamUpload } from "../middleware/cloudinaryUpload.js"; 

const router = express.Router();

router.post("/", teamUpload.single("image"), createTeamMember);
router.get("/", getAllTeamMembers);
router.delete("/:id", deleteTeamMember);
router.put("/:id", teamUpload.single("image"), updateTeamMember); // if you're updating

export default router;
