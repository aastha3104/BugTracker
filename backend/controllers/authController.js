import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = (account) =>
  jwt.sign(
    { id: account._id.toString(), role: account.role, email: account.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingUser || existingAdmin) return res.status(409).json({ message: "An account with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword, role: "user" });
    res.status(201).json({ message: "Account created successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password) return res.status(400).json({ message: "Email and password are required" });
    if (!emailPattern.test(normalizedEmail)) return res.status(400).json({ message: "Please enter a valid email address" });

    const user = await User.findOne({ email: normalizedEmail, role: "user" }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password) return res.status(400).json({ message: "Email and password are required" });
    if (!emailPattern.test(normalizedEmail)) return res.status(400).json({ message: "Please enter a valid email address" });

    const admin = await Admin.findOne({ email: normalizedEmail, role: "admin" }).select("+password");
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({
      message: "Admin login successful",
      token: createToken(admin),
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    next(error);
  }
}
