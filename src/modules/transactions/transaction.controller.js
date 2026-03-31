import {
  createTransaction,
  getPettyCashTransactionsService,
} from "./transaction.service.js";


export const createTransactions = async (req, res, next) => { 
  try {
    const result = await createTransaction(req.body);
    console.log("Transaction created:", result);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
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