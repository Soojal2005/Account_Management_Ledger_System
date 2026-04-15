// user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 important
    },

    role: {
      type: String,
      enum: ["ADMIN", "ACCOUNTANT", "USER"],
      default: "USER",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);