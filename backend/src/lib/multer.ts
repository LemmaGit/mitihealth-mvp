import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});
