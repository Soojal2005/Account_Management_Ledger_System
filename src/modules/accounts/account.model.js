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
  },

  // optional but powerful
  subtype: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

 
});
export const Account = mongoose.model("Account", accountSchema);