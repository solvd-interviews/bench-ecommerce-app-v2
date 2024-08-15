import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import { uploadFileLocally } from "@/lib/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

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

    for (let i = 0; i < parseInt(length); i++) {
      let file = formData.get("image-" + i);
      if (file instanceof Blob && typeof file.arrayBuffer === 'function') {
        const buffer = Buffer.from(await file.arrayBuffer());
        promises.push(uploadFileLocally(buffer));
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
      stock: parseInt(stock),
      isBlocked: String(isBlock === "true"),
      images: urls,
    };
    await dbConnect();
    const productMongo = new ProductModel(product);

    const resMongo = await productMongo.save();

    return NextResponse.json({ res: resMongo }, { status: 201 });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { message: "Internal server error", error: JSON.stringify(error) },
      { status: 500 }
    );
  }
};
