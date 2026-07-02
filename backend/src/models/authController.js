import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { env } from "../utils/env.js"; // Import env for consistent secret access

const generateToken = (id, role) => {
  // Ensure you have JWT_SECRET defined in your .env file
  return jwt.sign({ id, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const register = async (req, res) => {
  const { role, name, email, password, ...rest } = req.body;

  try {
    let user;
    if (role === "admin") {
      user = await Admin.create({ name, email, passwordHash: password });
    } else {
      // For students, rollNumber is required
      user = await User.create({ 
        name, 
        email, 
        passwordHash: password, 
        role: "student",
        ...rest 
      });
    }

    const token = generateToken(user._id, user.role);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { identifier, password, role } = req.body; // identifier can be email or rollNumber

  try {
    let user;
    if (role === "admin") {
      user = await Admin.findOne({ email: identifier });
    } else {
      user = await User.findOne({
        $or: [{ email: identifier }, { rollNumber: identifier }],
      });
    }

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber || null,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email/roll number or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};