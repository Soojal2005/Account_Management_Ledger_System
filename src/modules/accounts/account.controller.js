import  createAccount  from "./account.service.js";

const createAccountController = async (req, res) => {
  try {
    const account = await createAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export default createAccountController


