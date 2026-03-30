import express from "express";
import createAccount, { getAccountBalancedetails }  from "./account.controller.js";  

const router = express.Router();


router.post("/creation", createAccount);
router.get("/:accountId/balance",getAccountBalancedetails);
export default router;