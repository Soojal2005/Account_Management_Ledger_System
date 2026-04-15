import express from "express";
import {
  createTransactions,
  getPettyCashTransactions,
  receive_Money,
  send_Money,
} from "./transaction.controller.js";
import { authorize,protect } from "../../Auth/auth.middleware.js";
const router = express.Router();
router.use(protect);
router.post("/create-transaction", authorize("ADMIN", "ACCOUNTANT"), createTransactions);
router.get("/petty-cash", getPettyCashTransactions);
router.post("/receive", receive_Money);
router.post("/send", send_Money);
export default router;