import express from "express";
import * as ledgerController from "./leddger.controller.js";
import { protect,authorize } from "../../Auth/auth.middleware.js";
const router = express.Router();
router.use(protect);
router.get("/accounts/:accountId/entries", authorize("ADMIN", "ACCOUNTANT"), ledgerController.getEntriesByAccount);
router.get("/accounts/:accountId/balance", ledgerController.getAccountBalance);

router.get("/accounts/:accountId/ledger", ledgerController.getLedger);

// 🔥 Global APIs
router.get("/transactions/history/:accountId", ledgerController.getTransactionHistory);

router.get("/trial-balance",authorize("ADMIN", "ACCOUNTANT"), ledgerController.getTrialBalance);

router.get("/reports/petty-cash", authorize("ADMIN", "ACCOUNTANT"), ledgerController.getPettyCashReportController);

router.get("/reports/profit-loss",authorize("ADMIN", "ACCOUNTANT"), ledgerController.getProfitLossController);

router.get("/reports/balance-sheet", authorize("ADMIN", "ACCOUNTANT"), ledgerController.getBalanceSheetController);

export default router;