import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    description: String,
    date: { type: Date, default: Date.now },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "NEFT", "CARD"],
      required: true,
    },

    counterparty: {
      type: String,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    expenseCategory: {
      type: String,
      enum: ["PETTY", "REGULAR"],
      required: true,
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
  { timestamps: true },
);
export const Transaction = mongoose.model("Transaction", transactionSchema);
