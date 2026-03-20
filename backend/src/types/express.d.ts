import "express";
import type { File as MulterFile } from "multer";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    files?: MulterFile[];
    file?: MulterFile;
  }
}
