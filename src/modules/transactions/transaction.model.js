import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    description: String,
    date: { type: Date, default: Date.now },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "NEFT"],
      required: true,
    },

    counterparty: {
      type: String,
    },

    transactionCategory: {
      type: String,
      enum: ["PETTY_CASH", "NORMAL", "BANK", "ADJUSTMENT"],
      default: "NORMAL",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    entries: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        type: {
          type: String,
          enum: ["DEBIT", "CREDIT"],
        },
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);