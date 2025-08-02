import express from "express";
import { blogUpload } from "../middleware/cloudinaryUpload.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, blogUpload.single("image"), createBlog);
router.put("/:id", protect, blogUpload.single("image"), updateBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", protect, deleteBlog);

export default router;
