import { v2 as cloudinary } from "cloudinary";

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split("/");
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));
    const fullPath = urlParts.slice(versionIndex + 1).join("/");
    const publicId = fullPath.split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }

    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary👎");
    throw error;
  }
};
