import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, index: true },
    title: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "submitted", "graded"],
      default: "pending",
      required: true
    },
    totalMarks: { type: Number, required: true },
    marksObtained: { type: Number },
    submissionUrl: { type: String }
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", AssignmentSchema);
