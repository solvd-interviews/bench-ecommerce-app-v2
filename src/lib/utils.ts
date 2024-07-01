import { v2 } from "cloudinary";
import { UploadApiOptions } from "cloudinary";

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

v2.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts: UploadApiOptions = {
  overwrite: true,
  resource_type: "image",
  folder: "solvd/solvd-ecommerce/v1",
};

export const uploadImage = (image: string) => {
  return new Promise<string>((resolve, reject) => {
    v2.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        resolve(result.secure_url);
      } else {
        reject(error || { message: "Failed to upload image to Cloudinary" });
      }
    });
  });
};

export const uploadMultipleImages = (images: string[]) => {
  return Promise.all(images.map((base) => uploadImage(base)));
};
