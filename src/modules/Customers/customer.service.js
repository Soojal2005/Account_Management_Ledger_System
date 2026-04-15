import { Customer } from "./customer.model.js";
import  AppError   from "../../utils/AppError.js";

// ✅ Create Customer
export const createCustomer = async (data) => {
  const existing = await Customer.findOne({
    email: data.email,
    companyId: data.companyId,
  });

  if (existing) {
    throw new AppError("Customer already exists", 400);
  }

  return await Customer.create(data);
};

// ✅ Get All
export const getCustomers = async (companyId) => {
  return await Customer.find({ companyId, isActive: true });
};

// ✅ Get One
export const getCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return customer;
};

// ✅ Update
export const updateCustomer = async (customerId, data) => {
  const customer = await Customer.findByIdAndUpdate(
    customerId,
    data,
    { new: true }
  );

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return customer;
};

// ✅ Soft Delete
export const deleteCustomer = async (customerId) => {
  const customer = await Customer.findByIdAndUpdate(
    customerId,
    { isActive: false },
    { new: true }
  );

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  return customer;
};