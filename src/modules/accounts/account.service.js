import { Account } from "./account.model.js";
import AppError from "../../utils/AppError.js";
import { Entry } from "../ledger/entry.model.js";
import mongoose from "mongoose";
export const createAccount = async ({ name, balance, type }) => {
  // 🔥 1. Validations
  if (!name) {
    throw new AppError("Account name is required", 400);
  }

  if (!type) {
    throw new AppError("Account type is required", 400);
  }

  const validTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"];

  if (!validTypes.includes(type)) {
    throw new AppError("Invalid account type", 400);
  }

  // 🔥 2. Create account
  const account = await Account.create({
    name,
    type,
    balance: balance || 0, // optional
  });

  return account;
};


export const getAccountBalance = async (accountId) => {
  const result = await Entry.aggregate([
    {
      $match: {
        accountId: new mongoose.Types.ObjectId(accountId),
      },
    },
    {
      $group: {
        _id: "$accountId",
        balance: {
          $sum: {
            $cond: [
              { $eq: ["$type", "DEBIT"] }, // ✅ FIXED
              "$amount",
              { $multiply: ["$amount", -1] },
            ],
          },
        },
      },
    },
  ]);

  return result[0]?.balance || 0;
};

// ✅ Get Single Account
export const getAccountById = async (accountId) => {
  const account = await Account.findById(accountId);

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  return account;
};
export const updateAccount = async (accountId, updateData) => {
  const account = await Account.findByIdAndUpdate(
    accountId,
    updateData,
    { new: true }
  );

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  return account;
};
export const deleteAccount = async (accountId) => {
  const account = await Account.findByIdAndUpdate(
    accountId,
    { isActive: false },
    { new: true }
  );

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  return account;
};