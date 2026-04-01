import express from "express";
import * as ledgerController from "./leddger.controller.js";
import { protect,authorize } from "../../Auth/auth.middleware.js";
const router = express.Router();
router.use(protect);
router.get("/accounts/:accountId/entries", authorize("OWNER", "ADMIN"), ledgerController.getEntriesByAccount);

router.get("/accounts/:accountId/ledger", ledgerController.getLedger);

// 🔥 Global APIs
router.get("/transactions/history", ledgerController.getTransactionHistory);

router.get("/trial-balance",authorize("OWNER", "ADMIN"), ledgerController.getTrialBalance);

router.get("/reports/petty-cash", authorize("OWNER", "ADMIN"), ledgerController.getPettyCashReportController);

router.get("/reports/profit-loss",authorize("OWNER", "ADMIN"), ledgerController.getProfitLossController);

router.get("/reports/balance-sheet", authorize("OWNER", "ADMIN"), ledgerController.getBalanceSheetController);

export default router;