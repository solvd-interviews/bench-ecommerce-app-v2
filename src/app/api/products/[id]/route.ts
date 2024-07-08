import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  console.log("params:_ ", params);
  return new NextResponse("asd");
};
