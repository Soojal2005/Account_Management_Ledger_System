import express from "express";
import * as customerController from "./customer.controller.js";
import { protect } from "../../Auth/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Create
router.post("/", customerController.createCustomer);

// Get all
router.get("/company/:companyId", customerController.getCustomers);

// Get one
router.get("/:customerId", customerController.getCustomer);

// Update
router.put("/:customerId", customerController.updateCustomer);

// Delete
router.delete("/:customerId", customerController.deleteCustomer);

export default router;