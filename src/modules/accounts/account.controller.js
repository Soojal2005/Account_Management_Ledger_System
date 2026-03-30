import  {createAccount}  from "./account.service.js";
import {getAccountBalance} from "./account.service.js";
const createAccountController = async (req, res) => {
  try {
    const account = await createAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export default createAccountController;

export const getAccountBalancedetails = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const result = await getAccountBalance(accountId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
