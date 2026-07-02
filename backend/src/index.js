import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { env } from "./utils/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { noticesRouter } from "./routes/notices.routes.js";
import { assignmentRouter } from "./routes/assignment.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { adminResultsRouter } from "./routes/admin.results.routes.js";
import { studentResultsRouter } from "./routes/student.results.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

const app = express();

app.use(cors({ origin: env.FRONTEND_ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/admin/results", adminResultsRouter);
app.use("/api/student/results", studentResultsRouter);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));