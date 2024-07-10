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
    console.log("Uploaded Image URL:", url); // Log uploaded image URL
    return url;
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    console.log("formData: ", formData);
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

    const stock = formData.get("stock");
    if (!stock || typeof stock !== "string") {
      return NextResponse.json(
        { message: "Not correct stock." },
        { status: 400 }
      );
    }
    const isBlock = formData.get("isBlock");
    if (!isBlock || typeof isBlock !== "string") {
      return NextResponse.json(
        { message: "Not correct isBlock." },
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

    console.log("Promises are;: ", promises);
    const urls = await Promise.all(promises);
    console.log("urls are: ", urls);

    const product = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseInt(price),
      stock: parseInt(stock),
      isBlocked: Boolean(isBlock),
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
