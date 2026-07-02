import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { httpError } from "../utils/httpError.js";
import { env } from "../utils/env.js";

const signToken = (payload) => {
  return {
    accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }),
    refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }),
  };
};

export const authRouter = Router();

authRouter.post("/student/signup", async (req, res, next) => {
  try {
    console.log("BODY =>", req.body);
    const body = z
      .object({
        rollNumber: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        branch: z.string().min(1),
        semester: z.number().int().min(1).max(12)
      })
      .parse(req.body);

    const user = await User.create({
      rollNumber: body.rollNumber,
      email: body.email.toLowerCase(),
      passwordHash: body.password, // Model hook will hash this
      name: body.name,
      branch: body.branch,
      semester: body.semester
    });

    const tokenPayload = { sub: user._id.toString(), role: "student", rollNumber: user.rollNumber };
    const tokens = signToken(tokenPayload);

    res.json({
      ok: true,
      data: tokens
    });
  } catch (err) {
    console.log("SIGNUP ERROR =>", err);
    
    if (err?.code === 11000) return next(httpError(409, "User already exists"));
    next(err);
  }
});

authRouter.post("/student/login", async (req, res, next) => {
  try {
    const body = z
      .object({
        rollNumberOrEmail: z.string().min(1),
        password: z.string().min(1)
      })
      .parse(req.body);

    const q = body.rollNumberOrEmail.toLowerCase();
    const user = await User.findOne({
      $or: [{ rollNumber: body.rollNumberOrEmail }, { email: q }]
    });
    if (!user) return next(httpError(401, "Invalid credentials"));

    const ok = await user.comparePassword(body.password);
    if (!ok) return next(httpError(401, "Invalid credentials"));

    const tokenPayload = { sub: user._id.toString(), role: "student", rollNumber: user.rollNumber };
    const tokens = signToken(tokenPayload);

    res.json({
      ok: true,
      data: tokens
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/student/forgot-password", async (req, res, next) => {
  try {
    const body = z
      .object({
        rollNumber: z.string().min(1),
        email: z.string().email(),
        newPassword: z.string().min(8)
      })
      .parse(req.body);

    const user = await User.findOne({
      rollNumber: body.rollNumber,
      email: body.email.toLowerCase()
    });

    if (!user) {
      return next(httpError(404, "Student record not found with the provided roll number and email."));
    }

    user.passwordHash = body.newPassword; // Hook hashes on save
    await user.save();

    res.json({ ok: true, message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/admin/login", async (req, res, next) => {
  try {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1)
      })
      .parse(req.body);

    const admin = await Admin.findOne({ email: body.email.toLowerCase() });
    if (!admin) return next(httpError(401, "Invalid credentials"));

    const ok = await admin.comparePassword(body.password);
    if (!ok) return next(httpError(401, "Invalid credentials"));

    const tokenPayload = { sub: admin._id.toString(), role: "admin" };
    const tokens = signToken(tokenPayload);

    res.json({
      ok: true,
      data: tokens
    });
  } catch (err) {
    next(err);
  }
});

// one-time bootstrap (dev): create first admin if none exists
authRouter.post("/admin/bootstrap", async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8)
      })
      .parse(req.body);

    const count = await Admin.countDocuments();
    if (count > 0) return next(httpError(409, "Admin already exists"));

    const admin = await Admin.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash: body.password // Hook hashes on create
    });

    res.json({ ok: true, data: { id: admin._id.toString() } });
  } catch (err) {
    if (err?.code === 11000) return next(httpError(409, "Admin already exists"));
    next(err);
  }
});

// Public: verify whether a student roll number exists (no auth required)
authRouter.get("/verify-student/:rollNumber", async (req, res, next) => {
  try {
    const rollNumber = req.params.rollNumber.trim();
    if (!rollNumber) return next(httpError(400, "Roll number is required"));

    const user = await User.findOne({ rollNumber }).select("name branch semester rollNumber");
    if (!user) {
      return res.json({
        ok: true,
        data: { found: false }
      });
    }

    res.json({
      ok: true,
      data: {
        found: true,
        student: {
          rollNumber: user.rollNumber,
          name: user.name,
          branch: user.branch,
          semester: user.semester
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

