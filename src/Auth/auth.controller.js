import {registerUser} from "./auth.service.js";   
import {loginUser} from "./auth.service.js";
export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  } 
};

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);  
    }
}