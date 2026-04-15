import { Invoice } from "./invoice.model.js";
import { Customer } from "../Customers/customer.model.js";
import mongoose from "mongoose";
import  AppError  from "../../utils/AppError.js";
import {createTransaction}  from "../transactions/transaction.service.js";
import {Account} from "../accounts/account.model.js";
// ✅ Create Invoice
export const createInvoice = async (data) => {
  const { customerId, companyId, items } = data;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new AppError("Invalid customerId", 400);
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  if (customer.companyId.toString() !== companyId.toString()) {
    throw new AppError("Customer does not belong to your company", 403);
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("At least one invoice item is required", 400);
  }

  // 💰 Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price, 0 );

  const invoice = await Invoice.create({
    ...data,
    totalAmount,
  });

  return invoice;
};

export const markInvoicePaid = async (invoiceId, user) => {
  const companyId = user.companyId;

  if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
    throw new AppError("Invalid invoiceId", 400);
  }

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  if (invoice.companyId.toString() !== companyId.toString()) {
    throw new AppError("Unauthorized invoice access", 403);
  }

  if (invoice.status === "PAID") {
    throw new AppError("Invoice already paid", 400);
  }

  // ✅ Get accounts automatically
  const cashAccount = await Account.findOne({
    companyId,
    name: "Updated Cash", // use your existing one
  });

  const incomeAccount = await Account.findOne({
    companyId,
    type: "INCOME",
  });

  if (!cashAccount) {
    throw new AppError("Cash account not found", 400);
  }

  if (!incomeAccount) {
    throw new AppError("Income account not found", 400);
  }

  // ✅ Update invoice
  invoice.status = "PAID";
  await invoice.save();

  // 🔥 Create transaction (THIS IS THE CORE LINK)
  await createTransaction({
    description: "Invoice Payment",
    paymentMode: "CASH",
    companyId,
    transactionCategory: "NORMAL",
    customerId: invoice.customerId,
    entries: [
      {
        accountId: cashAccount._id,
        type: "DEBIT",
        amount: invoice.totalAmount,
      },
      {
        accountId: incomeAccount._id,
        type: "CREDIT",
        amount: invoice.totalAmount,
      },
    ],
  });

  return invoice;
};