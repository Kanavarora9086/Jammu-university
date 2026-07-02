import { Router } from "express";
import { z } from "zod";

import { Notice } from "../models/Notice.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const noticesRouter = Router();

noticesRouter.get("/", async (req, res, next) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ ok: true, data: { notices } });
  } catch (err) {
    next(err);
  }
});

noticesRouter.post("/", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const body = z
      .object({
        title: z.string().min(1),
        body: z.string().min(1),
        audience: z.enum(["all", "students", "admins"]).default("all")
      })
      .parse(req.body);

    const notice = await Notice.create({
      title: body.title,
      body: body.body,
      audience: body.audience,
      publishedByAdminId: req.auth.sub
    });

    res.status(201).json({ ok: true, data: { id: notice._id.toString() } });
  } catch (err) {
    next(err);
  }
});

noticesRouter.patch("/:id", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    const body = z
      .object({
        title: z.string().min(1).optional(),
        body: z.string().min(1).optional(),
        audience: z.enum(["all", "students", "admins"]).optional()
      })
      .parse(req.body);

    await Notice.updateOne({ _id: id }, { $set: body });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

noticesRouter.delete("/:id", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const id = z.string().min(1).parse(req.params.id);
    await Notice.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

