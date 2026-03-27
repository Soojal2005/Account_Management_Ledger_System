import express from "express";
import accountRoutes from "./modules/accounts/account.route.js";
import ledgerRoutes from "./modules/ledger/ledger.routes.js";
import transactionRoutes from "./modules/transactions/transaction.route.js";  
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jerry Accounts API Running 🚀");
});

app.use("/account", accountRoutes);
app.use("/ledger", ledgerRoutes);
app.use("/api/v1/transactions", transactionRoutes);
export default app;
