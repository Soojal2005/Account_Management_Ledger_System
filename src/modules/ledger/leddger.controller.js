import * as ledgerService from "./ledger.service.js";

// 🔥 Create Transaction
export const createTransaction = async (req, res, next) => {
  try {
    const result = await ledgerService.createTransaction(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 Get Account Balance
export const getAccountBalance = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const result = await ledgerService.getAccountBalance(accountId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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

// 🔥 Get Ledger (with running balance)
export const getLedger = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const result = await ledgerService.getLedger(accountId);

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
    const result = await ledgerService.getTransactionHistory();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 Trial Balance
export const getTrialBalance = async (req, res, next) => {
  try {
    const result = await ledgerService.getTrialBalance();

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
    const { companyId } = req.body;
    const { startDate, endDate } = req.query;

    const report = await getPettyCashReport(
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
    const { companyId } = req.body;
    const { startDate, endDate } = req.query;

    const report = await getProfitLossReport(
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
    const { companyId } = req.body;
    const { startDate, endDate } = req.query;

    const report = await getBalanceSheet(
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