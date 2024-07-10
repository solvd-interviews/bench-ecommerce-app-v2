import { blockProduct } from "@/lib/utils/products";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!request.body) {
    return NextResponse.json({ error: "No body sent." }, { status: 400 });
  }

  try {
    // Parse request body to get isBlocked status
    const body = await request.json();

    if (!body) {
      return new NextResponse("Invalid Data", { status: 400 });
    }
    const { isBlocked } = body;
    console.log("isBlocked: ", isBlocked);
    if (typeof isBlocked !== "boolean") {
      return NextResponse.json(
        { error: "isBlocked not found" },
        { status: 400 }
      );
    }
    // Call blockProduct function to update product
    const updatedProduct = await blockProduct(id, isBlocked);

    // Return success response
    return NextResponse.json({
      message: `Product ${id} blocked`,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error blocking product:", error);
    return NextResponse.json(
      { error: "Error blocking product" },
      { status: 500 }
    );
  }
};
