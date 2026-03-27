import Transaction from "./transaction.model.js";
import AppError from "../../utils/AppError.js";

export const createTransactionService = async (data) => {
  const {
    description,
    paymentMode,
    counterparty,
    entries,
    companyId,
  } = data;

  // 🔥 Category logic
  let transactionCategory = "NORMAL";
  if (paymentMode === "CASH") {
    transactionCategory = "PETTY_CASH";
  }

  // ✅ Double-entry validation
  const totalDebit = entries
    .filter(e => e.type === "DEBIT")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCredit = entries
    .filter(e => e.type === "CREDIT")
    .reduce((sum, e) => sum + e.amount, 0);

  if (totalDebit !== totalCredit) {
    throw new AppError("Debit and Credit must be equal", 400);
  }

  const transaction = await Transaction.create({
    description,
    paymentMode,
    counterparty,
    transactionCategory,
    companyId,
    entries,
  });

  return transaction;
};


// 🔥 Petty Cash Fetch
export const getPettyCashTransactionsService = async (companyId) => {
  return await Transaction.find({
    companyId,
    transactionCategory: "PETTY_CASH",
  })
    .populate("entries.accountId", "name type")
    .sort({ date: -1 });
};