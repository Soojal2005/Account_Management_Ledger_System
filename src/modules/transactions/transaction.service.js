import {Transaction }from "./transaction.model.js";
import AppError from "../../utils/AppError.js";
import mongoose from "mongoose";
import { Entry } from "../ledger/entry.model.js";
import { Account } from "../accounts/account.model.js";

export const createTransaction = async (data) => {
  const {
    description,
    paymentMode = "CASH",
    companyId,
    entries,
    expenseCategory = "REGULAR",
    transactionCategory = "NORMAL",
  } = data;

  if (!companyId) {
    throw new AppError("companyId is required", 400);
  }

  if (!Array.isArray(entries) || entries.length < 2) {
    throw new AppError("At least two entries are required", 400);
  }

  // ✅ Validation
  const totalDebit = entries
    .filter(e => e.type === "DEBIT")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCredit = entries
    .filter(e => e.type === "CREDIT")
    .reduce((sum, e) => sum + e.amount, 0);

  if (totalDebit !== totalCredit) {
    throw new AppError("Debit and Credit must be equal", 400);
  }

  // ✅ Create transaction
  const transaction = await Transaction.create({
    description,
    paymentMode,
    companyId,
    expenseCategory,
    transactionCategory,
    entries: []
  });

  // ✅ Create entries
  const createdEntries = await Entry.insertMany(
    entries.map((entry) => ({
      accountId: entry.accountId,
      type: entry.type,
      amount: entry.amount,
      transactionId: transaction._id,
      companyId,
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


export const receiveMoney = async (data) => {
  const {
    companyId,
    amount,
    cashAccountId,
    customerId,
    incomeAccountId,
    description,
  } = data;

  // ✅ Validate accounts
  const cash = await Account.findById(cashAccountId);
  const income = await Account.findById(incomeAccountId);

  if (!cash || !income) {
    throw new AppError("Invalid accounts", 400);
  }

  if (
    cash.companyId.toString() !== companyId ||
    income.companyId.toString() !== companyId
  ) {
    throw new AppError("Accounts must belong to same company", 400);
  }

  // ✅ Create double entry transaction
  const transaction = await createTransaction({
    companyId,
    description,
    paymentMode: "CASH",
    expenseCategory: "REGULAR",
    transactionCategory: "NORMAL",
    customerId: customerId || null,
    entries: [
      {
        accountId: cashAccountId,
        type: "DEBIT",
        amount,
      },
      {
        accountId: incomeAccountId,
        type: "CREDIT",
        amount,
      },
    ],
  });

  return transaction;
};

export const sendMoney = async (data) => {
  const {
    companyId,
    amount,
    cashAccountId,
    expenseAccountId,
    description,
  } = data;

  const cash = await Account.findById(cashAccountId);
  const expense = await Account.findById(expenseAccountId);

  if (!cash || !expense) {
    throw new AppError("Invalid accounts", 400);
  }

  if (
    cash.companyId.toString() !== companyId ||
    expense.companyId.toString() !== companyId
  ) {
    throw new AppError("Accounts must belong to same company", 400);
  }

  const transaction = await createTransaction({
    companyId,
    description,
    paymentMode: "CASH",
    expenseCategory: "REGULAR",
    transactionCategory: "NORMAL",
    entries: [
      {
        accountId: expenseAccountId,
        type: "DEBIT",
        amount,
      },
      {
        accountId: cashAccountId,
        type: "CREDIT",
        amount,
      },
    ],
  });

  return transaction;
};