
import mongoose from "mongoose";
import {Transaction} from "../transactions/transaction.model.js";
import {Entry} from "./entry.model.js";
import AppError from "../../utils/AppError.js";
import { Account } from "../accounts/account.model.js";

// export const createTransaction = async ({
//   description,
//   paymentMode,
//   companyId,
//   entries,
// }) => {
//   // 1. Create transaction
//   const transaction = await Transaction.create({
//     description,
//     paymentMode,
//     companyId,
//   });

//   // 2. Attach transactionId to entries
//   const entriesWithTransactionId = entries.map((entry) => ({
//     ...entry,
//     transactionId: transaction._id,
//   }));

//   // 3. Insert entries
//   await Entry.insertMany(entriesWithTransactionId);

//   return transaction;
// };




export const getTransactionHistory = async (
  accountId,
  companyId,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const account = await Account.findById(accountId);

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  if (account.companyId.toString() !== companyId.toString()) {
    throw new AppError("Account does not belong to your company", 403);
  }

  // 🔥 1. Fetch entries
  const entries = await Entry.find({
    accountId: new mongoose.Types.ObjectId(accountId),
    companyId,
  })
    .sort({ createdAt: -1 }) // latest first
    .skip(skip)
    .limit(limit)
    .populate("accountId", "name"); // optional

  // 🔥 2. Total count (for pagination)
  const total = await Entry.countDocuments({
    accountId: new mongoose.Types.ObjectId(accountId),
    companyId,
  });

  if (total === 0) {
    const totalAcrossAllCompanies = await Entry.countDocuments({
      accountId: new mongoose.Types.ObjectId(accountId),
    });

    if (totalAcrossAllCompanies > 0) {
      throw new AppError(
        "Entries exist for this account, but are mapped to a different company. Please verify companyId mapping in transaction entries.",
        409
      );
    }
  }

  return {
    entries,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

export const getTrialBalance = async (companyId) => {
  const result = await Entry.aggregate([
  {
    $match: {
      companyId: new mongoose.Types.ObjectId(companyId),
    }
  },
  {
    $group: {
      _id: "$accountId",
      totalDebit: {
        $sum: {
          $cond: [
            { $eq: ["$type", "DEBIT"] },
            "$amount",
            0
          ]
        }
      },
      totalCredit: {
        $sum: {
          $cond: [
            { $eq: ["$type", "CREDIT"] },
            "$amount",
            0
          ]
        }
      }
    }
  },
  {
    $lookup: {
      from: "accounts",
      localField: "_id",
      foreignField: "_id",
      as: "account"
    }
  },
  {
    $unwind: "$account"
  },
  {
    $project: {
      accountId: "$_id",
      accountName: "$account.name",
      totalDebit: 1,
      totalCredit: 1
    }
  }
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

export const getAccountBalance = async (accountId, companyId) => {
  const account = await Account.findById(accountId).select("name type companyId");

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  if (account.companyId.toString() !== companyId.toString()) {
    throw new AppError("Account does not belong to your company", 403);
  }

  const summary = await Entry.aggregate([
    {
      $match: {
        accountId: new mongoose.Types.ObjectId(accountId),
        companyId: new mongoose.Types.ObjectId(companyId),
      },
    },
    {
      $group: {
        _id: "$accountId",
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
  ]);

  const totals = summary[0] || { totalDebit: 0, totalCredit: 0 };

  return {
    accountId: account._id,
    accountName: account.name,
    accountType: account.type,
    totalDebit: totals.totalDebit,
    totalCredit: totals.totalCredit,
    balance: totals.totalDebit - totals.totalCredit,
  };
};


export const getLedger = async (accountId, companyId) => {
  const account = await Account.findById(accountId);

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  if (account.companyId.toString() !== companyId.toString()) {
    throw new AppError("Account does not belong to your company", 403);
  }

  // ✅ Step 1: Fetch entries
  const entries = await Entry.find({ accountId, companyId })
    .populate("transactionId", "description")
    .sort({ createdAt: 1 });

  // ✅ Step 2: Initialize running balance
  let runningBalance = 0;

  // ✅ Step 3: Build ledger
  const ledger = entries.map((entry) => {
    const isDebit = entry.type === "DEBIT";
    const isCredit = entry.type === "CREDIT";

    if (isDebit) {
      runningBalance += entry.amount;
    } else if (isCredit) {
      runningBalance -= entry.amount;
    }

    return {
      date: entry.createdAt,
      description: entry.transactionId?.description || "",
      debit: isDebit ? entry.amount : 0,
      credit: isCredit ? entry.amount : 0,
      balance: runningBalance,
    };
  });

  return ledger;
};

export const getPettyCashReport = async (companyId, startDate, endDate) => {
  const matchStage = {
    companyId,
    type: "DEBIT",
  };

  // ✅ Date filter
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return await Entry.aggregate([
    // 🔗 Join transaction
    {
      $lookup: {
        from: "transactions",
        localField: "transactionId",
        foreignField: "_id",
        as: "transaction",
      },
    },
    { $unwind: "$transaction" },

    // ✅ Correct filtering
    {
      $match: {
        ...matchStage,
        "transaction.expenseCategory": "PETTY", // 🔥 FIXED
      },
    },

    // 🔥 Group by account + payment mode
    {
      $group: {
        _id: {
          accountId: "$accountId",
          paymentMode: "$transaction.paymentMode",
        },
        totalAmount: { $sum: "$amount" },
      },
    },

    // 🔗 Get account name
    {
      $lookup: {
        from: "accounts",
        localField: "_id.accountId",
        foreignField: "_id",
        as: "account",
      },
    },
    { $unwind: "$account" },

    // 🎯 Final output
    {
      $project: {
        _id: 0,
        accountName: "$account.name",
        paymentMode: "$_id.paymentMode",
        totalAmount: 1,
      },
    },

    { $sort: { totalAmount: -1 } },
  ]);
};


export const getProfitLossReport = async (companyId, startDate, endDate) => {
  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  const dateMatch = {};
  if (startDate && endDate) {
    dateMatch.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const result = await Entry.aggregate([
    {
      $match: {
        companyId: companyObjectId,
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
    { $unwind: "$transaction" },
    {
      $match: {
        ...dateMatch,
      },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        as: "account",
      },
    },
    { $unwind: "$account" },
    {
      $match: {
        "account.type": { $in: ["INCOME", "EXPENSE"] },
      },
    },
    {
      $project: {
        accountType: "$account.type",
        signedAmount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    { $eq: ["$account.type", "INCOME"] },
                    { $eq: ["$type", "CREDIT"] },
                  ],
                },
                then: "$amount",
              },
              {
                case: {
                  $and: [
                    { $eq: ["$account.type", "INCOME"] },
                    { $eq: ["$type", "DEBIT"] },
                  ],
                },
                then: { $multiply: ["$amount", -1] },
              },
              {
                case: {
                  $and: [
                    { $eq: ["$account.type", "EXPENSE"] },
                    { $eq: ["$type", "DEBIT"] },
                  ],
                },
                then: "$amount",
              },
              {
                case: {
                  $and: [
                    { $eq: ["$account.type", "EXPENSE"] },
                    { $eq: ["$type", "CREDIT"] },
                  ],
                },
                then: { $multiply: ["$amount", -1] },
              },
            ],
            default: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$accountType",
        total: { $sum: "$signedAmount" },
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

export const getBalanceSheet = async () => {
  const result = await Entry.aggregate([
    {
      $group: {
        _id: "$accountId",
        debit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        credit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
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
  ]);

  const assets = [];
  const liabilities = [];
  const equity = [];

  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  for (const item of result) {
    const { debit, credit, account } = item;

    let balance = 0;

    // 🔥 NORMALIZATION (same as before)
    if (["ASSET", "EXPENSE"].includes(account.type)) {
      balance = debit - credit;
    } else {
      balance = credit - debit;
    }

    const accountData = {
      accountId: account._id,
      name: account.name,
      balance,
    };

    if (account.type === "ASSET") {
      assets.push(accountData);
      totalAssets += balance;
    }

    if (account.type === "LIABILITY") {
      liabilities.push(accountData);
      totalLiabilities += balance;
    }

    if (account.type === "EQUITY") {
      equity.push(accountData);
      totalEquity += balance;
    }
  }

  const isBalanced =
    totalAssets === totalLiabilities + totalEquity;

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    isBalanced,
  };
};