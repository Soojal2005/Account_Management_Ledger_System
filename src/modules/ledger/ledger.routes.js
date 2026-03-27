import express from "express";
import * as ledgerController from "./ledger.controller.js";

const router = express.Router();

// 🔥 Transactions
router.post("/transactions", ledgerController.createTransaction);

// 🔥 Account-based APIs
router.get("/accounts/:accountId/balance", ledgerController.getAccountBalance);

router.get("/accounts/:accountId/entries", ledgerController.getEntriesByAccount);

router.get("/accounts/:accountId/ledger", ledgerController.getLedger);

// 🔥 Global APIs
router.get("/transactions/history", ledgerController.getTransactionHistory);

router.get("/trial-balance", ledgerController.getTrialBalance);

router.get("/reports/petty-cash", ledgerController.getPettyCashReportController);

router.get("/reports/profit-loss", ledgerController.getProfitLossController);

router.get("/reports/balance-sheet", getBalanceSheetController);
export default router;