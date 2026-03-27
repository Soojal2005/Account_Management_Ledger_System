import { Account } from "./account.model.js";
import AppError from "../../utils/AppError.js";

const createAccount = async ({ name, balance, type }) => {
  // 🔥 1. Validations
  if (!name) {
    throw new AppError("Account name is required", 400);
  }

  if (!type) {
    throw new AppError("Account type is required", 400);
  }

  const validTypes = ["asset", "liability", "income", "expense", "equity"];

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

export default createAccount;