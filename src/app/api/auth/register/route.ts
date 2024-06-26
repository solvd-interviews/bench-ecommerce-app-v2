import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import UserModel from "@/lib/models/UserModel";
import dbConnect from "@/lib/dbConnect";

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json();
  await dbConnect();
  const hashedPassword = await hash(password, 5);
  const newUser = new UserModel({
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return Response.json(
      { message: "User has been created" },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
};
