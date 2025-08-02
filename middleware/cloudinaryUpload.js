// middleware/cloudinaryUpload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // Make sure this is correct

// 🔧 Function to generate uploaders based on folderName
const createCloudinaryUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName, // e.g., 'blogs', 'services', 'team'
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1000, crop: "limit" }], // optional
    },
  });

  return multer({ storage });
};

// 👇 Export specific uploaders
export const blogUpload = createCloudinaryUploader("SutralQ_Blogs");
export const serviceUpload = createCloudinaryUploader("SutralQ_Services");
export const teamUpload = createCloudinaryUploader("SutralQ_Team");

