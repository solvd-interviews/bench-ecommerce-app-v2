import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
