import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🛡️ REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // 🧱 1. Validate Input
    if (!name || !email || !password || !username) {
      console.warn("⚠️ Missing fields:", req.body);
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // 🔍 2. Check for Existing Email
    const emailExists = await Admin.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // 🔍 3. Check for Existing Username
    const usernameExists = await Admin.findOne({ username: normalizedUsername });
    if (usernameExists) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // 🔐 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 💾 5. Create Admin
    const newAdmin = new Admin({
      name: name.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
    });

    await newAdmin.save();

    // 🎉 6. Respond
    res.status(201).json({ message: "Admin registered successfully." });

  } catch (err) {
    console.error("❌ Register error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `Duplicate ${field}.` });
    }
    res.status(500).json({ message: "Internal Server Error." });
  }
};


// 🔐 LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🧱 1. Validate Input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 🔍 2. Find Admin by Email
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 🔐 3. Compare Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 🔑 4. Generate JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // 🎉 5. Respond
    res.status(200).json({
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
      },
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
