import multer from "multer";

export function uploadMiddleware() {
  const fileStorageEngine = multer.memoryStorage();
  return multer({ storage: fileStorageEngine });
}