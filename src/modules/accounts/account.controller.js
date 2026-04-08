import * as accountService from "./account.service.js";

// Create Account
export const createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.body,req.user);

    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

// Get Accounts
export const getAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getAccountsByCompany(
      req.params.companyId,
      req.user
    );

    res.json({
      success: true,
      data: accounts,
    });
  } catch (err) {
    next(err);
  }
};

// Get Single
export const getAccount = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(
      req.params.accountId
    );

    res.json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

// Update
export const updateAccount = async (req, res, next) => {
  try {
    const account = await accountService.updateAccount(
      req.params.accountId,
      req.body
    );

    res.json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

// Delete
export const deleteAccount = async (req, res, next) => {
  try {
    const account = await accountService.deleteAccount(
      req.params.accountId
    );

    res.json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};