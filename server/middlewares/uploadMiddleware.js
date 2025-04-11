import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const fieldName = file.fieldname;
    const folder = fieldName.split("_")[1] || "trendz/others";

    const originalName = file.originalname.split(".").slice(0, -1).join(".");
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    const allowedFormats = ["png", "jpg", "jpeg", "webp", "avif"];
    if (!allowedFormats.includes(fileExtension)) {
      throw new Error(
        "Invalid file format. Only PNG, JPG, and WEBP are allowed."
      );
    }

    return {
      folder: folder,
      format: fileExtension,
      public_id: `${originalName}_${Date.now()}`,
      // public_id: "women-collection",
      resource_type: "auto",
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "auto" },
      ],
    };
  },
});

const upload = multer({ storage });

export default upload.any();
