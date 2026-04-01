import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    items: [
      {
        description: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    issuedDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ companyId: 1 });

export const Invoice = mongoose.model("Invoice", invoiceSchema);