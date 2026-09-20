import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import path from "path";
import config from "../../config";

// Configure Cloudinary SDK
if (
  config.cloudinary.cloud_name &&
  config.cloudinary.api_key &&
  config.cloudinary.api_secret
) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
    secure: true,
  });
  console.log("[Cloudinary] Configured with cloud:", config.cloudinary.cloud_name);
}

export const uploadImageFile = async (
  file: Express.Multer.File
): Promise<{ url: string; public_id?: string; provider: "cloudinary" | "local" }> => {
  const isCloudinaryConfigured = Boolean(
    config.cloudinary.cloud_name &&
    config.cloudinary.api_key &&
    config.cloudinary.api_secret &&
    !config.cloudinary.cloud_name.includes("your_cloud_name")
  );

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "dishdiary/recipes",
          resource_type: "image",
          transformation: [
            { quality: "auto:good", fetch_format: "auto" },
            { width: 1200, crop: "limit" },
          ],
        },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            console.error("[Cloudinary] Upload failed, falling back:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              provider: "cloudinary",
            });
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  // Fallback: Save to uploads/ folder if Cloudinary credentials are not provided yet
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExt = path.extname(file.originalname) || ".jpg";
  const fileName = `dish-${Date.now()}-${Math.round(Math.random() * 1e6)}${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, file.buffer);
  console.log(`[Storage] Saved file to local storage: /uploads/${fileName}`);

  return {
    url: `http://localhost:${config.port}/uploads/${fileName}`,
    provider: "local",
  };
};

/**
 * Extracts public_id from Cloudinary URL
 * Example: https://res.cloudinary.com/dimczn2y6/image/upload/v1726823456/dishdiary/recipes/dish_abc123.jpg
 * Returns: dishdiary/recipes/dish_abc123
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  let pathAfterUpload = parts[1].split("?")[0];
  const segments = pathAfterUpload.split("/");
  const versionIndex = segments.findIndex((seg) => /^v\d+$/.test(seg));

  let publicPathSegments: string[];
  if (versionIndex !== -1) {
    publicPathSegments = segments.slice(versionIndex + 1);
  } else {
    const folderIndex = segments.findIndex((seg) => seg === "dishdiary");
    if (folderIndex !== -1) {
      publicPathSegments = segments.slice(folderIndex);
    } else {
      publicPathSegments = segments;
    }
  }

  const fullPathWithExt = publicPathSegments.join("/");
  const lastDotIndex = fullPathWithExt.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return fullPathWithExt.substring(0, lastDotIndex);
  }
  return fullPathWithExt;
};

/**
 * Deletes an image from Cloudinary or local storage
 */
export const deleteImageFile = async (
  target: string
): Promise<{ success: boolean; message: string; result?: any }> => {
  if (!target) {
    return { success: false, message: "Target image not provided" };
  }

  // Handle local files
  if (target.includes("/uploads/")) {
    const fileName = path.basename(target.split("?")[0]);
    const filePath = path.join(process.cwd(), "uploads", fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[Storage] Deleted local file: ${fileName}`);
        return { success: true, message: "Local file deleted successfully" };
      } catch (err: any) {
        console.error("[Storage] Failed to delete local file:", err);
        return { success: false, message: err.message || "Failed to delete local file" };
      }
    }
    return { success: true, message: "File already removed locally" };
  }

  const isCloudinaryConfigured = Boolean(
    config.cloudinary.cloud_name &&
    config.cloudinary.api_key &&
    config.cloudinary.api_secret &&
    !config.cloudinary.cloud_name.includes("your_cloud_name")
  );

  let publicId = target;
  if (target.startsWith("http://") || target.startsWith("https://")) {
    const extracted = extractPublicIdFromUrl(target);
    if (extracted) {
      publicId = extracted;
    }
  }

  if (isCloudinaryConfigured) {
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });
      console.log(`[Cloudinary] Destroy result for '${publicId}':`, res);
      return {
        success: res.result === "ok" || res.result === "not found",
        message: res.result === "ok" ? "Image deleted from Cloudinary" : `Cloudinary status: ${res.result}`,
        result: res,
      };
    } catch (error: any) {
      console.error(`[Cloudinary] Destroy failed for '${publicId}':`, error);
      return { success: false, message: error.message || "Cloudinary delete failed" };
    }
  }

  return { success: false, message: "Cloudinary is not configured" };
};

export { cloudinary };
