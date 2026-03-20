import streamifier from "streamifier";
import status from "http-status";
import cloudinary from "../lib/cloudinary.ts";
import catchAsync from "../utils/catchAsync.ts";

export const uploadMultipleImages = catchAsync(async (req, res, next) => {
  const files = req.files;

  if (!files || !files.length) {
    return res
      .status(status.BAD_REQUEST)
      .json({ message: "No files uploaded" });
  }

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
  req.body.imageUrls = urls;
  next();
});
