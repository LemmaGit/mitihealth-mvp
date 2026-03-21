import streamifier from "streamifier";
import cloudinary from "../lib/cloudinary.ts";
import type { Request } from "express";


export const uploadImage = (req: Request, folder = "herbs") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
//@ts-ignore
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });



