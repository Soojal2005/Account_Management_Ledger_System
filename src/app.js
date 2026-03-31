import express from "express";
import accountRoutes from "./modules/accounts/account.route.js";
import ledgerRoutes from "./modules/ledger/ledger.routes.js";
import transactionRoutes from "./modules/transactions/transaction.route.js";  
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Jerry Accounts API Running 🚀");
});

app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/ledger", ledgerRoutes);
app.use("/api/v1/transaction", transactionRoutes);
export default app;
