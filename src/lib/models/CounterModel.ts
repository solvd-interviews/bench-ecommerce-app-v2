import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const CounterModel =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export default CounterModel;
