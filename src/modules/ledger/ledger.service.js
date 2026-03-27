import mongoose from "mongoose";
import { Entry } from "./entry.model.js";
import {Transaction} from "../transactions/transaction.model.js";
import { Account } from "../accounts/account.model.js";

import mongoose from "mongoose";
import Transaction from "../transactions/transaction.model.js";
import Entry from "./entry.model.js";
import AppError from "../../utils/AppError.js";

export const createTransaction = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      description,
      date,
      entries,
      paymentMode,
      counterparty,
      companyId,
    } = data;

    // ✅ 1. Validate entries exist
    if (!entries || entries.length < 2) {
      throw new AppError("At least two entries are required", 400);
    }

    // ✅ 2. Validate double-entry system
    const totalDebit = entries
      .filter((e) => e.type === "DEBIT")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalCredit = entries
      .filter((e) => e.type === "CREDIT")
      .reduce((sum, e) => sum + e.amount, 0);

    if (totalDebit !== totalCredit) {
      throw new AppError("Debit and Credit must be equal", 400);
    }

    // 🔥 3. Decide transaction category
    let transactionCategory = "NORMAL";
    if (paymentMode === "CASH") {
      transactionCategory = "PETTY_CASH";
    }

    // ✅ 4. Create Transaction
    const [transaction] = await Transaction.create(
      [
        {
          description,
          date,
          paymentMode,
          counterparty,
          transactionCategory,
          companyId,
        },
      ],
      { session }
    );

    // ✅ 5. Create Entries
    const entryDocs = entries.map((e) => ({
      transactionId: transaction._id,
      accountId: e.accountId,
      type: e.type,
      amount: e.amount,
      date: date || new Date(),
      companyId,
    }));

    const createdEntries = await Entry.insertMany(entryDocs, { session });

    // ✅ 6. Link entries to transaction (optional but good)
    transaction.entries = createdEntries.map((e) => ({
      accountId: e.accountId,
      type: e.type,
      amount: e.amount,
    }));

    await transaction.save({ session });

    // ✅ 7. Commit
    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
              { $eq: ["$type", "debit"] },
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


export const getTransactionHistory = async (
  accountId,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  // 🔥 1. Fetch entries
  const entries = await Entry.find({
    accountId: new mongoose.Types.ObjectId(accountId),
  })
    .sort({ createdAt: -1 }) // latest first
    .skip(skip)
    .limit(limit)
    .populate("accountId", "name"); // optional

  // 🔥 2. Total count (for pagination)
  const total = await Entry.countDocuments({
    accountId: new mongoose.Types.ObjectId(accountId),
  });

  return {
    entries,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

export const getTrialBalance = async () => {
  const result = await Entry.aggregate([
    {
      $group: {
        _id: "$accountId",
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "_id",
        foreignField: "_id",
        as: "account",
      },
    },
    {
      $unwind: "$account",
    },
    {
      $project: {
        accountName: "$account.name",
        totalDebit: 1,
        totalCredit: 1,
      },
    },
  ]);

  // 👉 Final check
  const totalDebit = result.reduce((sum, acc) => sum + acc.totalDebit, 0);
  const totalCredit = result.reduce((sum, acc) => sum + acc.totalCredit, 0);

  return {
    accounts: result,
    totalDebit,
    totalCredit,
    isBalanced: totalDebit === totalCredit,
  };
};

export const getEntriesByAccount = async (accountId) => {
  const entries = await Entry.aggregate([
    {
      $match: {
        accountId: new mongoose.Types.ObjectId(accountId),
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "transactionId",
        foreignField: "_id",
        as: "transaction",
      },
    },
    {
      $unwind: "$transaction",
    },
    {
      $project: {
        _id: 1,
        type: 1,
        amount: 1,
        date: "$transaction.date",
        description: "$transaction.description",
      },
    },
    {
      $sort: {
        date: 1, // oldest first (important for running balance later)
      },
    },
  ]);

  return entries;
};

export const getLedger = async (accountId) => {
  const entries = await Entry.aggregate([
    {
      $match: {
        accountId: new mongoose.Types.ObjectId(accountId),
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "transactionId",
        foreignField: "_id",
        as: "transaction",
      },
    },
    {
      $unwind: "$transaction",
    },
    {
      $project: {
        type: 1,
        amount: 1,
        date: "$transaction.date",
        description: "$transaction.description",
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  let balance = 0;

  const ledger = entries.map((entry) => {
    if (entry.type === "debit") {
      balance += entry.amount;
    } else {
      balance -= entry.amount;
    }

    return {
      date: entry.date,
      description: entry.description,
      debit: entry.type === "debit" ? entry.amount : 0,
      credit: entry.type === "credit" ? entry.amount : 0,
      balance,
    };
  });

  return ledger;
};

export const getPettyCashReport = async (companyId, startDate, endDate) => {
  const matchStage = {
    companyId,
    type: "DEBIT",
  };

  // 🔥 Add date filter if provided
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return await Entry.aggregate([
    {
      $lookup: {
        from: "transactions",
        localField: "transactionId",
        foreignField: "_id",
        as: "transaction",
      },
    },
    { $unwind: "$transaction" },

    {
      $match: {
        ...matchStage,
        "transaction.transactionCategory": "PETTY_CASH",
      },
    },

    {
      $group: {
        _id: "$accountId",
        totalAmount: { $sum: "$amount" },
      },
    },

    {
      $lookup: {
        from: "accounts",
        localField: "_id",
        foreignField: "_id",
        as: "account",
      },
    },
    { $unwind: "$account" },

    {
      $project: {
        _id: 0,
        accountName: "$account.name",
        totalAmount: 1,
      },
    },

    { $sort: { totalAmount: -1 } },
  ]);
};


export const getProfitLossReport = async (companyId, startDate, endDate) => {
  const matchStage = {
    companyId,
  };

  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const result = await Entry.aggregate([
    // 🔥 Join with accounts
    {
      $lookup: {
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        as: "account",
      },
    },
    { $unwind: "$account" },

    // ✅ Filter only Income & Expense accounts
    {
      $match: {
        ...matchStage,
        "account.type": { $in: ["INCOME", "EXPENSE"] },
      },
    },

    // 🔥 Group by account type
    {
      $group: {
        _id: "$account.type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;

  result.forEach((item) => {
    if (item._id === "INCOME") {
      totalIncome = item.total;
    } else if (item._id === "EXPENSE") {
      totalExpenses = item.total;
    }
  });

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
  };
};

export const getBalanceSheet = async (companyId, startDate, endDate) => {
  const matchStage = { companyId };

  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const result = await Entry.aggregate([
    // 🔥 Join accounts
    {
      $lookup: {
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        as: "account",
      },
    },
    { $unwind: "$account" },

    // ✅ Filter relevant account types
    {
      $match: {
        ...matchStage,
        "account.type": { $in: ["ASSET", "LIABILITY", "EQUITY"] },
      },
    },

    // 🔥 Calculate signed amount
    {
      $addFields: {
        signedAmount: {
          $cond: [
            // ASSET logic
            { $eq: ["$account.type", "ASSET"] },
            {
              $cond: [
                { $eq: ["$type", "DEBIT"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
            // LIABILITY + EQUITY logic
            {
              $cond: [
                { $eq: ["$type", "CREDIT"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          ],
        },
      },
    },

    // 🔥 Group totals
    {
      $group: {
        _id: "$account.type",
        total: { $sum: "$signedAmount" },
      },
    },
  ]);

  let assets = 0;
  let liabilities = 0;
  let equity = 0;

  result.forEach((item) => {
    if (item._id === "ASSET") assets = item.total;
    if (item._id === "LIABILITY") liabilities = item.total;
    if (item._id === "EQUITY") equity = item.total;
  });

  return {
    assets,
    liabilities,
    equity,
    isBalanced: assets === liabilities + equity,
  };
};