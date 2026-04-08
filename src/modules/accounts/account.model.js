import mongoose from "mongoose";
const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"],
    required: true,
    default: "ASSET"
  },

  parentAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },

  companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  subtype: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

},{timestamps: true});
export const Account = mongoose.model("Account", accountSchema);