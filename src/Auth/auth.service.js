import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { Company } from "../model/company.model.js";

export const registerUser = async ({ name, email, password, companyName }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1️⃣ Create user (temporary without company)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "OWNER",
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
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      userId: user._id,
      companyId: user.companyId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};