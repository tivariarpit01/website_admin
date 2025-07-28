import express from "express";
import upload from "../middleware/multerMiddleware.js"; // your multer setup
import {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", upload.single("image"), createTeamMember);
// image field name should match
router.get("/", getTeamMembers);
router.put("/:id", upload.single("image"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
