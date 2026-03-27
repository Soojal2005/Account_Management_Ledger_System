import express from "express";
import {
  createTransaction,
  getPettyCashTransactions,
} from "./transaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/petty-cash", getPettyCashTransactions);

export default router;