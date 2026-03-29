import streamifier from "streamifier";
import cloudinary from "../lib/cloudinary";
import catchAsync from "../utils/catchAsync";

export const uploadMultipleImages = catchAsync(async (req, res, next) => {
  // @ts-ignore
  const files = req.files as Express.Multer.File[];

  // Allow requests that do not change images (e.g. PATCH updates).
  // For POST create, the Zod schema will still require `imageUrls`.
  if (!files || !files.length) return next();

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  });

  const urls = await Promise.all(uploadPromises);
  req.body.imageUrls = urls as string[];
  next();
});
