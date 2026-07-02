import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import { z } from "zod";

import { requireAuth, requireRole } from "../middleware/auth.js";
import { Result } from "../models/Result.js";
import { computeSgpa } from "../utils/grading.js";
import { httpError } from "../utils/httpError.js";

export const adminResultsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Excel format (one row per subject mark):
// rollNumber, semester, subjectCode, subjectName, credits, marks
adminResultsRouter.post(
  "/upload-excel",
  requireAuth,
  requireRole(["admin"]),
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file?.buffer) return next(httpError(400, "Missing file"));

      const wb = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) return next(httpError(400, "Excel has no sheets"));

      const sheet = wb.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      console.log("ROWS =>", rows);

      const rowSchema = z.object({
        rollNumber: z.coerce.string().min(1),
        semester: z.coerce.number().int().min(1).max(12),
        subjectCode: z.coerce.string().min(1),
        subjectName: z.coerce.string().min(1),
        credits: z.coerce.number().min(0.5).max(20),
        marks: z.coerce.number().min(0).max(100)
      });

      const byStudentSem = new Map();
      for (const raw of rows) {
        const r = rowSchema.parse(raw);
        const key = `${r.rollNumber}::${r.semester}`;
        const entry = byStudentSem.get(key) || {
          rollNumber: r.rollNumber,
          semester: r.semester,
          subjects: []
        };
        entry.subjects.push({
          subjectCode: r.subjectCode,
          subjectName: r.subjectName,
          credits: r.credits,
          marks: r.marks
        });
        byStudentSem.set(key, entry);
      }

      const upserts = [];
      for (const entry of byStudentSem.values()) {
        const sgpa = computeSgpa(entry.subjects);

        // cgpa approximation: average of all semester sgpas after upsert
        // we'll compute properly after saving by querying all results
        upserts.push({ ...entry, sgpa });
      }

      let insertedOrUpdated = 0;
      for (const u of upserts) {
        await Result.updateOne(
          { rollNumber: u.rollNumber, semester: u.semester },
          {
            $set: {
              subjects: u.subjects,
              sgpa: u.sgpa,
              cgpa: u.sgpa,
              uploadedByAdminId: req.auth.sub
            }
          },
          { upsert: true }
        );

        const all = await Result.find({ rollNumber: u.rollNumber }).select("sgpa");
        const cgpa =
          all.length === 0
            ? u.sgpa
            : Number(
              (
                all.reduce((sum, r) => sum + (r.sgpa || 0), 0) / all.length
              ).toFixed(2)
            );
        await Result.updateMany({ rollNumber: u.rollNumber }, { $set: { cgpa } });

        insertedOrUpdated += 1;
      }

      res.json({
        ok: true,
        data: {
          sheets: wb.SheetNames,
          rows: rows.length,
          resultDocumentsTouched: insertedOrUpdated
        }
      });
    } catch (err) {
      console.log("UPLOAD ERROR =>", err);
      next(err);
    }
  }
);

adminResultsRouter.patch(
  "/:rollNumber/:semester",
  requireAuth,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const params = z
        .object({
          rollNumber: z.coerce.string().min(1),
          semester: z.coerce.number().int().min(1).max(12)
        })
        .parse(req.params);

      const body = z
        .object({
          subjects: z
            .array(
              z.object({
                subjectCode: z.string().min(1),
                subjectName: z.string().min(1),
                credits: z.number().min(0.5).max(20),
                marks: z.number().min(0).max(100)
              })
            )
            .min(1)
        })
        .parse(req.body);

      const sgpa = computeSgpa(body.subjects);
      await Result.updateOne(
        { rollNumber: params.rollNumber, semester: params.semester },
        { $set: { subjects: body.subjects, sgpa } }
      );

      const all = await Result.find({ rollNumber: params.rollNumber }).select("sgpa");
      const cgpa =
        all.length === 0
          ? sgpa
          : Number((all.reduce((sum, r) => sum + (r.sgpa || 0), 0) / all.length).toFixed(2));
      await Result.updateMany({ rollNumber: params.rollNumber }, { $set: { cgpa } });

      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

adminResultsRouter.delete(
  "/:rollNumber/:semester",
  requireAuth,
  requireRole(["admin"]),
  async (req, res, next) => {
    try {
      const params = z
        .object({
          rollNumber: z.string().min(1),
          semester: z.coerce.number().int().min(1).max(12)
        })
        .parse(req.params);

      await Result.deleteOne({ rollNumber: params.rollNumber, semester: params.semester });

      const all = await Result.find({ rollNumber: params.rollNumber }).select("sgpa");
      if (all.length > 0) {
        const cgpa = Number((all.reduce((sum, r) => sum + (r.sgpa || 0), 0) / all.length).toFixed(2));
        await Result.updateMany({ rollNumber: params.rollNumber }, { $set: { cgpa } });
      }

      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

