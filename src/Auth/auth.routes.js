import express from "express";
import { register, login } from "./auth.controller.js";
import { protect, authorize } from "./auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
export default router;