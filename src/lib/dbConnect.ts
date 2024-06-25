import mongoose from "mongoose";

async function dbConnect() {
  try {
    console.log("process.env.MONGODB_URI: ", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    throw new Error("Connection failed!");
  }
}

export default dbConnect;
