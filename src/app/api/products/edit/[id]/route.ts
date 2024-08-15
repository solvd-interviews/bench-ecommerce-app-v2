import { uploadFileLocally } from "@/lib/utils/cloudinary";
import ProductModel from "@/lib/models/ProductModel";
import { deleteImage, getPublicIdFromUrl } from "@/lib/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!request.body) {
    return NextResponse.json({ error: "No body sent." }, { status: 400 });
  }

  try {
    // Parse request body to get isBlocked status
    const formData = await request.formData();

    if (!formData) {
      return new NextResponse("Invalid formData", { status: 400 });
    }

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

    const name = formData.get("name");

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Not correct name." },
        { status: 400 }
      );
    }

    const description = formData.get("description");

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "Not correct description." },
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
    const isBlocked = formData.get("isBlocked");

    if (!isBlocked || typeof isBlocked !== "string") {
      return NextResponse.json(
        { message: "Not correct isBlocked." },
        { status: 400 }
      );
    }

    const filesDeleted = JSON.parse(
      formData.get("filesDeleted")?.toString() || ""
    );

    let promisesDelete: Promise<{ ok: boolean }>[] = [];

    if (Array.isArray(filesDeleted) && filesDeleted.length > 0) {

      filesDeleted.forEach((_, index) => {
        promisesDelete.push(
          deleteImage(getPublicIdFromUrl(filesDeleted[index]))
        );
      });
      const res = await Promise.all(promisesDelete);
    }

    let product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let promises: (Promise<string | undefined> | string)[] = [];

    for (let i = 0; i < parseInt(length); i++) {
      let file = formData.get("image-" + i);
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        promises.push(uploadFileLocally(buffer));
      } else if (typeof file === "string") {
        promises.push(file);
      } else {
        return NextResponse.json(
          { error: "File type not correct" },
          { status: 404 }
        );
      }
    }

    const urls = await Promise.all(promises);

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.isBlocked = isBlocked;
    product.images = urls;

    // Save the updated product
    const res = await product.save();

    // Return success response
    return NextResponse.json({
      message: `Product ${id} updated successfully`,
      product: res,
    });
  } catch (error) {
    console.error("Error blocking product:", error);
    return NextResponse.json(
      { error: "Error blocking product" },
      { status: 500 }
    );
  }
};
