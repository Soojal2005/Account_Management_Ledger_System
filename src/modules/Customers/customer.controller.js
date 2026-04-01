import * as customerService from "./customer.service.js";

// Create
export const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

// Get All
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getCustomers(
      req.params.companyId
    );

    res.json({
      success: true,
      data: customers,
    });
  } catch (err) {
    next(err);
  }
};

// Get One
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId
    );

    res.json({
      success: true,
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

// Update
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.customerId,
      req.body
    );

    res.json({
      success: true,
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.deleteCustomer(
      req.params.customerId
    );

    res.json({
      success: true,
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};