import { cloudinary } from "../configs/cloudinary";
import { CLOUDINARY_UPLOAD_FOLDER } from "../configs/env";

export const uploadFile = async (req: any) => {
  const fileStr = req.file.buffer.toString("base64");
  const uploadResponse = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${fileStr}`,
    {
      folder: CLOUDINARY_UPLOAD_FOLDER,
    }
  );
  return uploadResponse.url;
};
