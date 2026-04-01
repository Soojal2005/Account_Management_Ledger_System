import express from "express";
import * as invoiceController from "./invoice.controller.js";
import { protect } from "../../Auth/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Create invoice
router.post("/", invoiceController.createInvoice);

// Mark as paid
router.post("/:invoiceId/pay", invoiceController.markInvoicePaid);

export default router;