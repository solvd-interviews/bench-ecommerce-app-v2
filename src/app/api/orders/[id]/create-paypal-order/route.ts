import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import { paypal } from "@/lib/paypal";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { user } = await getServerSession(config);

  if (!user) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  await dbConnect();

  const order = await OrderModel.findById(params.id);
  if (order) {
    try {
      const paypalOrder = await paypal.createOrder(order.totalPrice);
      return Response.json(paypalOrder);
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      );
    }
  } else {
    return Response.json(
      { message: "Order not found" },
      {
        status: 404,
      }
    );
  }
};
