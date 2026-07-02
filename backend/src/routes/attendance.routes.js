import { Router } from "express";
import { z } from "zod";

import { Attendance } from "../models/Attendance.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { httpError } from "../utils/httpError.js";
import { User } from "../models/User.js";

export const attendanceRouter = Router();

// Student: View own attendance
attendanceRouter.get("/me", requireAuth, requireRole(["student"]), async (req, res, next) => {
  try {
    const rollNumber = req.auth.rollNumber;
    const records = await Attendance.find({ rollNumber }).sort({ subjectCode: 1 }).lean();
    res.json({ ok: true, data: records });
  } catch (err) {
    next(err);
  }
});

// Admin: View a student's attendance
attendanceRouter.get(
  "/student/:rollNumber",
  requireAuth,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const rollNumber = req.params.rollNumber;
      const records = await Attendance.find({ rollNumber }).sort({ subjectCode: 1 }).lean();
      res.json({ ok: true, data: records });
    } catch (err) {
      next(err);
    }
  }
);

// Admin: Upsert attendance record for a student
attendanceRouter.post("/", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const body = z
      .object({
        rollNumber: z.string().min(1),
        subjectCode: z.string().min(1),
        subjectName: z.string().min(1),
        totalClasses: z.coerce.number().int().min(0),
        presentClasses: z.coerce.number().int().min(0)
      })
      .parse(req.body);

    if (body.presentClasses > body.totalClasses) {
      return next(httpError(400, "Present classes cannot exceed total classes"));
    }

    // Verify student exists
    const user = await User.findOne({ rollNumber: body.rollNumber });
    if (!user) {
      return next(httpError(404, "Student not found in registered database"));
    }

    const record = await Attendance.findOneAndUpdate(
      { rollNumber: body.rollNumber, subjectCode: body.subjectCode },
      {
        $set: {
          subjectName: body.subjectName,
          totalClasses: body.totalClasses,
          presentClasses: body.presentClasses
        }
      },
      { upsert: true, new: true }
    );

    res.json({ ok: true, data: record });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete an attendance record
attendanceRouter.delete(
  "/:rollNumber/:subjectCode",
  requireAuth,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const { rollNumber, subjectCode } = req.params;
      await Attendance.deleteOne({ rollNumber, subjectCode });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);
