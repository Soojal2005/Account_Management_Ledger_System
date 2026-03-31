import {Transaction }from "./transaction.model.js";
import AppError from "../../utils/AppError.js";
import mongoose from "mongoose";
import { Entry } from "../ledger/entry.model.js";

export const createTransaction = async (data) => {
  const { description, paymentMode, companyId, entries } = data;

  // ✅ Validation
  const totalDebit = entries
    .filter(e => e.type === "DEBIT")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCredit = entries
    .filter(e => e.type === "CREDIT")
    .reduce((sum, e) => sum + e.amount, 0);

  if (totalDebit !== totalCredit) {
    throw new Error("Debit and Credit must be equal");
  }

  // ✅ Create transaction
  const transaction = await Transaction.create({
    description,
    paymentMode,
    companyId,
    entries: []
  });

  // ✅ Create entries
  const createdEntries = await Entry.insertMany(
    entries.map((entry) => ({
      accountId: entry.accountId,
      type: entry.type,
      amount: entry.amount,
      transactionId: transaction._id
    }))
  );

  // ✅ Link entries
  transaction.entries = createdEntries.map(e => e._id);
  await transaction.save();

  return transaction;
};


export const getPettyCashTransactionsService = async (companyId) => {
  return await Transaction.find({
    companyId,
    transactionCategory: "PETTY_CASH",
  })
    .populate("entries.accountId", "name type")
    .sort({ date: -1 });
};