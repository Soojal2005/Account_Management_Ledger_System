import * as ledgerService from "./ledger.service.js";
import mongoose from "mongoose";

// 🔥 Create Transaction
// export const createTransaction = async (req, res, next) => {
//   try {
//     const result = await ledgerService.createTransaction(req.body);
//     console.log("Transaction created:", result);
//     res.status(201).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// 🔥 Get Account Balance


// 🔥 Get Entries by Account
export const getEntriesByAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const result = await ledgerService.getEntriesByAccount(accountId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountBalance = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Account ID",
      });
    }

    const result = await ledgerService.getAccountBalance(
      accountId,
      req.user.companyId
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 Get Ledger (with running balance)
export const getLedger = async (req, res, next) => {
  try {
    const { accountId } = req.params;

     if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Account ID",
      });
    }

    const result = await ledgerService.getLedger(accountId, req.user.companyId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 Transaction History
export const getTransactionHistory = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Account ID",
      });
    }

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await ledgerService.getTransactionHistory(
      accountId,
      req.user.companyId,
      page,
      limit
    );

    const response = {
      success: true,
      data: result,
    };

    if (result.pagination.total === 0) {
      response.message =
        "No transaction entries found for this account in your company.";
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// 🔥 Trial Balance
export const getTrialBalance = async (req, res, next) => {
  try {
    const result = await ledgerService.getTrialBalance(req.user.companyId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};





export const getPettyCashReportController = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { startDate, endDate } = req.query;

    const report = await ledgerService.getPettyCashReport(
      companyId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};


export const getProfitLossController = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { startDate, endDate } = req.query;

    const report = await ledgerService.getProfitLossReport(
      companyId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

export const getBalanceSheetController = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { startDate, endDate } = req.query;

    const report = await ledgerService.getBalanceSheet(
      companyId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};