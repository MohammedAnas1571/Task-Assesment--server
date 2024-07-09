import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;


export const imageMulter = multer({
  storage: multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: DestinationCallback): void {
      cb(null, "public");
    },
    filename: function (req: Request, file: Express.Multer.File, cb: FilenameCallback): void {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }) as StorageEngine,
});
