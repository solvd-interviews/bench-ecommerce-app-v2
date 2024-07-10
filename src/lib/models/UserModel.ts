import mongoose from "mongoose";
import CounterModel from "./CounterModel";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    userNumber: { type: Number, unique: true }, // Add this field
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  console.log("userSchema.presave");
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "userNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    console.log("counter: ", counter);
    this.userNumber = counter.seq;
  }
  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
