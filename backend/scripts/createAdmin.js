import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

dotenv.config();

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;
if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Set MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running this command");
}
if (ADMIN_PASSWORD.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");

try {
  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existingAdmin = await Admin.findOne({ email });
  const existingUser = await User.findOne({ email });
  if (existingAdmin || existingUser) throw new Error("An account with this email already exists");
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.create({ name: ADMIN_NAME, email, password, role: "admin" });
  console.log(`Admin account created for ${email}`);
} finally {
  await mongoose.disconnect();
}