import express from "express";
import {
  createTransactions,
  getPettyCashTransactions,
} from "./transaction.controller.js";

const router = express.Router();

router.post("/create-transaction", createTransactions);
router.get("/petty-cash", getPettyCashTransactions);

export default router;