import Blog from "../models/BlogModel.js";

// @desc Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    const blog = new Blog({ title, content, image, tags });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Blog creation failed" });
  }
};

// @desc Get All Blogs
export const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc Get Blog by ID
export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

// @desc Update Blog
export const updateBlog = async (req, res) => {
  const { title, content, image, tags } = req.body;
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, content, image, tags },
    { new: true }
  );
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

// @desc Delete Blog
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json({ message: "Blog deleted" });
};
