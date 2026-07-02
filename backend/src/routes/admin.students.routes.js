import { Router } from "express";
import { z } from "zod";

import { requireAuth, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { httpError } from "../utils/httpError.js";

export const adminStudentsRouter = Router();

adminStudentsRouter.use(requireAuth, requireRole(["admin"]));

adminStudentsRouter.get("/", async (req, res, next) => {
  try {
    const q = z
      .object({
        rollNumber: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(200).default(50),
        offset: z.coerce.number().int().min(0).default(0)
      })
      .parse(req.query);

    const filter = q.rollNumber ? { rollNumber: q.rollNumber } : {};
    const [items, total] = await Promise.all([
      User.find(filter)
        .select("rollNumber email name branch semester createdAt")
        .sort({ createdAt: -1 })
        .skip(q.offset)
        .limit(q.limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    res.json({ ok: true, data: { items, total } });
  } catch (err) {
    next(err);
  }
});

adminStudentsRouter.post("/", async (req, res, next) => {
  try {
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
      passwordHash: body.password, // Let the User model pre-save hook handle hashing
      name: body.name,
      branch: body.branch,
      semester: body.semester
    });

    res.status(201).json({ ok: true, data: { id: user._id.toString() } });
  } catch (err) {
    if (err?.code === 11000) return next(httpError(409, "User already exists"));
    next(err);
  }
});

adminStudentsRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const body = z
      .object({
        email: z.string().email().optional(),
        name: z.string().min(1).optional(),
        branch: z.string().min(1).optional(),
        semester: z.number().int().min(1).max(12).optional()
      })
      .parse(req.body);

    const update = { ...body };
    if (update.email) update.email = update.email.toLowerCase();

    await User.updateOne({ _id: id }, { $set: update });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

adminStudentsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    await User.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
