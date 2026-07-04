import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import fs from "node:fs";

import { env } from "./utils/env.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminStudentsRouter } from "./routes/admin.students.routes.js";
import { adminResultsRouter } from "./routes/admin.results.routes.js";
import { studentResultsRouter } from "./routes/student.results.routes.js";
import { noticesRouter } from "./routes/notices.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { assignmentRouter } from "./routes/assignment.routes.js";
import { feedbackRouter } from "./routes/feedback.routes.js";

export const app = express();

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 300
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/admin/students", adminStudentsRouter);
app.use("/api/admin/results", adminResultsRouter);
app.use("/api/student/results", studentResultsRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/feedback", feedbackRouter);

// serve uploaded images (profile photos)
app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use(notFoundHandler);
app.use(errorHandler);

