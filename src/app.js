import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import accountRoutes from "./modules/accounts/account.route.js";
import ledgerRoutes from "./modules/ledger/ledger.routes.js";
import transactionRoutes from "./modules/transactions/transaction.route.js";  
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Auth/auth.routes.js";
import customerRoutes from "./modules/Customers/customer.routes.js";
import invoiceRoutes from "./modules/invoices/invoice.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import AppError from "./utils/AppError.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Jerry Accounts API Running 🚀");
});

app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/ledger", ledgerRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorMiddleware);
export default app;
