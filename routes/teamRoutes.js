// routes/teamRoutes.js
import express from "express";
import {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", createTeamMember);
router.get("/", getTeamMembers);
router.put("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
