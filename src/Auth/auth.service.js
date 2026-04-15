import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { Company } from "../model/company.model.js";
import AppError from "../utils/AppError.js";

export const registerUser = async ({ name, email, password, companyName,role }) => {
  if (!name || !email || !password || !companyName) {
    throw new AppError("Name, email, password and companyName are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1️⃣ Create user (temporary without company)
  const user = await User.create({
    name : name,
    email: email,
    password: hashedPassword,
    role: role || "USER", // Default to user role
  });

  // 2️⃣ Create company
  const company = await Company.create({
    name: companyName,
    ownerId: user._id,
    employees: [user._id],
  });

  // 3️⃣ Link company to user
  user.companyId = company._id;
  await user.save();

  // 4️⃣ Generate token
  const token = jwt.sign(
    {
      userId: user._id,
      companyId: company._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, company, token };
};


export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = jwt.sign(
    {
      userId: user._id,
      companyId: user.companyId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};