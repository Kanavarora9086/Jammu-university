import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, index: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    totalClasses: { type: Number, required: true, default: 0 },
    presentClasses: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per student and subject code
AttendanceSchema.index({ rollNumber: 1, subjectCode: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
