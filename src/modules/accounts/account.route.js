import express from "express";
import createAccount  from "./account.controller.js";  
const router = express.Router();


router.post("/creation", createAccount);

export default router;