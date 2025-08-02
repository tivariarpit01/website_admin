import Blog from "../models/BlogModel.js";
import fs from "fs";
import path from "path";
// Assuming you have a way to get the base directory, like __dirname or import.meta.url
// For CommonJS: const __dirname = path.resolve();
// For ES Modules:
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createBlog = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and Content are required" });
    }

    // Split tags string by comma and trim whitespace
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    const blog = new Blog({
      title,
      content,
      author: author || req.user?.name,
      tags: tagsArray, // Use the parsed tags array
      image: req.file ? req.file.filename : null,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error("Create Blog Error:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    console.log('Backend: Received request to fetch all blog posts.'); // Log when function is called

    const blogs = await Blog.find().sort({ createdAt: -1 });

    console.log(`Backend: Successfully fetched ${blogs.length} blog posts from DB.`); // Log number of posts found
    // console.log('Backend: Blog data being sent:', blogs); // Optional: Log the actual data being sent (use cautiously in production)

    res.json(blogs);
    console.log('Backend: Sent JSON response with blog posts.'); // Log after sending response

  } catch (err) {
    console.error("Backend: Error fetching blogs:", err); // Keep existing error logging
    res.status(500).json({ message: "Failed to fetch blogs" });
    console.log('Backend: Sent 500 error response.'); // Log after sending error response
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    // Split tags string by comma and trim whitespace
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : blog.tags;

    if (req.file) {
      // Delete old image
      if (blog.image) {
        const imagePath = path.join(__dirname, "..", "uploads", "blogs", blog.image); // Corrected path with __dirname
        if (fs.existsSync(imagePath)) { // Added a check if the file exists before deleting
           fs.unlinkSync(imagePath);
        } else {
           console.log(`Backend: Old image not found at ${imagePath}, skipping deletion.`);
        }
      }
      blog.image = req.file.filename;
    }

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image) {
       const imagePath = path.join(__dirname, "..", "uploads", "blogs", blog.image); // Corrected path with __dirname
       if (fs.existsSync(imagePath)) { // Added a check if the file exists before deleting
         fs.unlinkSync(imagePath);
       } else {
         console.log(`Backend: Image not found at ${imagePath}, skipping deletion.`);
       }
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
