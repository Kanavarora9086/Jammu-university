import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Result } from "../models/Result.js";
import { User } from "../models/User.js";

export const studentResultsRouter = Router();

studentResultsRouter.get("/me", requireAuth, requireRole(["student"]), async (req, res, next) => {
  try {
    const rollNumber = req.auth.rollNumber;
    const [user, results] = await Promise.all([
      User.findOne({ rollNumber }).lean(),
      Result.find({ rollNumber }).sort({ semester: 1 }).lean()
    ]);
    res.json({
      ok: true,
      data: {
        rollNumber,
        name: user?.name || "Student",
        email: user?.email || "",
        branch: user?.branch || "",
        semester: user?.semester || 1,
        profilePhotoUrl: user?.profilePhotoUrl || "",
        results
      }
    });
  } catch (err) {
    next(err);
  }
});

studentResultsRouter.get(
  "/me/:semester",
  requireAuth,
  requireRole(["student"]),
  async (req, res, next) => {
    try {
      const rollNumber = req.auth.rollNumber;
      const semester = Number(req.params.semester);
      const result = await Result.findOne({ rollNumber, semester }).lean();
      res.json({ ok: true, data: { rollNumber, result } });
    } catch (err) {
      next(err);
    }
  }
);

