import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      index: true, // 🔥 important
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true, // 🔥 important
    },
    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Entry = mongoose.model("Entry", entrySchema);