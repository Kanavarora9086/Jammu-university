import { Router } from "express";
import { z } from "zod";

import { Assignment } from "../models/Assignment.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { httpError } from "../utils/httpError.js";
import { User } from "../models/User.js";

export const assignmentRouter = Router();

// Student: View own assignments
assignmentRouter.get("/me", requireAuth, requireRole(["student"]), async (req, res, next) => {
  try {
    const rollNumber = req.auth.rollNumber;
    const records = await Assignment.find({ rollNumber }).sort({ dueDate: 1 }).lean();
    res.json({ ok: true, data: records });
  } catch (err) {
    next(err);
  }
});

// Student: Submit an assignment
assignmentRouter.post("/me/:id/submit", requireAuth, requireRole(["student"]), async (req, res, next) => {
  try {
    const id = req.params.id;
    const rollNumber = req.auth.rollNumber;
    const body = z.object({ submissionUrl: z.string().url() }).parse(req.body);

    const assignment = await Assignment.findOne({ _id: id, rollNumber });
    if (!assignment) {
      return next(httpError(404, "Assignment not found"));
    }

    if (assignment.status === "graded") {
      return next(httpError(400, "Cannot resubmit a graded assignment"));
    }

    assignment.submissionUrl = body.submissionUrl;
    assignment.status = "submitted";
    await assignment.save();

    res.json({ ok: true, data: assignment });
  } catch (err) {
    next(err);
  }
});

// Admin: View a student's assignments
assignmentRouter.get(
  "/student/:rollNumber",
  requireAuth,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const rollNumber = req.params.rollNumber;
      const records = await Assignment.find({ rollNumber }).sort({ dueDate: 1 }).lean();
      res.json({ ok: true, data: records });
    } catch (err) {
      next(err);
    }
  }
);

// Admin: Issue a new assignment
assignmentRouter.post("/", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const body = z
      .object({
        rollNumber: z.string().min(1),
        title: z.string().min(1),
        subjectCode: z.string().min(1),
        subjectName: z.string().min(1),
        dueDate: z.string().transform((v) => new Date(v)),
        totalMarks: z.coerce.number().int().min(1)
      })
      .parse(req.body);

    // Verify student exists
    const user = await User.findOne({ rollNumber: body.rollNumber });
    if (!user) {
      return next(httpError(404, "Student not found in registered database"));
    }

    const record = await Assignment.create({
      rollNumber: body.rollNumber,
      title: body.title,
      subjectCode: body.subjectCode,
      subjectName: body.subjectName,
      dueDate: body.dueDate,
      status: "pending",
      totalMarks: body.totalMarks
    });

    res.status(201).json({ ok: true, data: record });
  } catch (err) {
    next(err);
  }
});

// Admin: Grade a submission
assignmentRouter.patch("/:id/grade", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = z
      .object({
        marksObtained: z.coerce.number().min(0)
      })
      .parse(req.body);

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return next(httpError(404, "Assignment not found"));
    }

    if (body.marksObtained > assignment.totalMarks) {
      return next(httpError(400, "Marks obtained cannot exceed total marks"));
    }

    assignment.marksObtained = body.marksObtained;
    assignment.status = "graded";
    await assignment.save();

    res.json({ ok: true, data: assignment });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete assignment
assignmentRouter.delete("/:id", requireAuth, requireRole(["admin"]), async (req, res, next) => {
  try {
    const id = req.params.id;
    await Assignment.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
