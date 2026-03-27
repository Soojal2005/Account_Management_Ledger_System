import {
  createTransactionService,
  getPettyCashTransactionsService,
} from "./transaction.service.js";

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await createTransactionService(req.body);

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
};


export const getPettyCashTransactions = async (req, res, next) => {
  try {
    const { companyId } = req.body; // adjust later with auth

    const data = await getPettyCashTransactionsService(companyId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};