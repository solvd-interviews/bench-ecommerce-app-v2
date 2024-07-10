import { deleteProduct } from "@/lib/utils/products";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const res = await deleteProduct(id);

    console.log("params:_ ", params);
    return NextResponse.json({ res });
  } catch (error) {
    console.error("Error blocking product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
};
