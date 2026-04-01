import { Invoice } from "./invoice.model.js";
import { Customer } from "../Customers/customer.model.js";
import  AppError  from "../../utils/AppError.js";
import {createTransaction}  from "../transactions/transaction.service.js";

// ✅ Create Invoice
export const createInvoice = async (data) => {
  const { customerId, companyId, items } = data;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404);
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

export const markInvoicePaid = async (invoiceId, data) => {
  const { cashAccountId, incomeAccountId } = data;

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new AppError("Invoice not found", 404);
  }

  if (invoice.status === "PAID") {
    throw new AppError("Invoice already paid", 400);
  }

  // 🔥 Create transaction
  await createTransaction({
    companyId: invoice.companyId,
    description: "Invoice payment",
    customerId: invoice.customerId,
    entries: [
      {
        accountId: cashAccountId,
        type: "DEBIT",
        amount: invoice.totalAmount,
      },
      {
        accountId: incomeAccountId,
        type: "CREDIT",
        amount: invoice.totalAmount,
      },
    ],
  });

  // ✅ Update invoice
  invoice.status = "PAID";
  await invoice.save();

  return invoice;
};