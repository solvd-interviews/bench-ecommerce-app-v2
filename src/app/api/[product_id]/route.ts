import { fetchProductById } from '../../../lib/utils/productDetail';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { product_id: string } }
) => {
  if (typeof params.product_id === 'string') {
    try {
      const product = await fetchProductById(params.product_id);
      if (product) {
        return new NextResponse(JSON.stringify(product), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new NextResponse(JSON.stringify({ message: "Product not found" }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new NextResponse(JSON.stringify({ message: "Error fetching product", error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new NextResponse(JSON.stringify({ message: "An unknown error occurred" }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
  } else {
    return new NextResponse(JSON.stringify({ message: "Invalid product ID" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
