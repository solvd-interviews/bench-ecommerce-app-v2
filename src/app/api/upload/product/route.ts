import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import { uploadImage } from "@/lib/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

async function uploadFileLocally(image: File) {
  if (image && image instanceof File) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const url = await uploadImage("data:image/jpeg;base64," + base64String);
    return url;
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    let length = formData.get("imgLength");
    if (!length || typeof length !== "string") {
      return NextResponse.json(
        { message: "Not correct data." },
        { status: 400 }
      );
    }
    const price = formData.get("price");
    if (!price || typeof price !== "string") {
      return NextResponse.json(
        { message: "Not correct price." },
        { status: 400 }
      );
    }

    let promises: Promise<string | undefined>[] = [];
    for (let index = 0; index < parseInt(length); index++) {
      let file = formData.get("image-" + index);
      if (file instanceof File) {
        promises.push(uploadFileLocally(file));
      } else {
        return NextResponse.json(
          { message: "Not correct data type in image attribute." },
          { status: 400 }
        );
      }
    }

    const urls = await Promise.all(promises);
    const product = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseInt(price),
      images: urls,
    };
    await dbConnect();
    const productMongo = new ProductModel(product);

    const resMongo = await productMongo.save();

    return NextResponse.json({ res: resMongo }, { status: 201 });
  } catch (error) {
    console.error("Error handling upload:", error); // Log detailed error message
    return NextResponse.json(
      { message: "Internal server error", error: JSON.stringify(error) },
      { status: 500 }
    );
  }
};
