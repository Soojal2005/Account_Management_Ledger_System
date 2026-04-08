import express from "express";
import * as accountController from "./account.controller.js";
import { protect } from "../../Auth/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/creation", accountController.createAccount);

router.get("/company/:companyId", accountController.getAccounts);

router.get("/:accountId", accountController.getAccount);

router.put("/update/:accountId", accountController.updateAccount);

router.delete("/:accountId", accountController.deleteAccount);

export default router;