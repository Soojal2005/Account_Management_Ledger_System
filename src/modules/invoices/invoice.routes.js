import express from "express";
import * as invoiceController from "./invoice.controller.js";
import { protect,allowRoles } from "../../Auth/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Create invoice
router.post("/create",
  allowRoles("ADMIN", "ACCOUNTANT"), invoiceController.createInvoice);

// Mark as paid
router.post("/:invoiceId/pay", invoiceController.markInvoicePaid);

export default router;