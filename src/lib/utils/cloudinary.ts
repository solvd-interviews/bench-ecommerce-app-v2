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
  folder: "solvd/solvd-ecommerce/v2",
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

// Utility to delete an image from Cloudinary
export const deleteImage = (publicId: string) => {
  return new Promise<{ ok: boolean }>((resolve, reject) => {
    v2.uploader.destroy(publicId, (error, result) => {
      if (result && result.result === "ok") {
        resolve({ ok: true });
      } else {
        reject(error || { message: "Failed to delete image from Cloudinary" });
      }
    });
  });
};

export const getPublicIdFromUrl = (url: string) => {
  // Remove the base URL and transformation parts if any
  const parts = url.split("/");
  const publicIdIndex = parts.findIndex((part) => part === "upload") + 2;
  return parts
    .slice(publicIdIndex)
    .join("/")
    .replace(/\.[^/.]+$/, ""); // Remove file extension
};

export async function uploadFileLocally(buffer: Buffer) {
  const base64String = buffer.toString("base64");
  const url = await uploadImage("data:image/jpeg;base64," + base64String);
  return url;
}
