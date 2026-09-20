import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadImageFile, deleteImageFile } from "../../lib/cloudinary";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../error/AppError";

const router = Router();

// Configure Multer for memory storage with a 10MB size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed!", 400));
    }
  },
});

router.post(
  "/",
  upload.single("image"),
  catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Please select an image file to upload", 400);
    }

    const uploadResult = await uploadImageFile(req.file);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Image uploaded successfully",
      data: uploadResult,
    });
  })
);

// Delete image from Cloudinary or local storage
const handleDeleteImage = catchAsync(async (req: Request, res: Response) => {
  const target = req.body?.public_id || req.body?.url || req.query?.public_id || req.query?.url;

  if (!target) {
    throw new AppError("Please provide public_id or url to delete", 400);
  }

  const result = await deleteImageFile(String(target));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message || "Image deleted successfully",
    data: result,
  });
});

router.delete("/", handleDeleteImage);
router.post("/delete", handleDeleteImage);

export const uploadRoutes = router;
