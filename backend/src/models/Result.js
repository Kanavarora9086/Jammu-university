import mongoose from "mongoose";

const SubjectMarkSchema = new mongoose.Schema(
  {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    credits: { type: Number, required: true, min: 0.5, max: 20 },
    marks: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const ResultSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, index: true },
    semester: { type: Number, required: true, min: 1, max: 12, index: true },
    subjects: { type: [SubjectMarkSchema], default: [] },
    sgpa: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    uploadedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

ResultSchema.index({ rollNumber: 1, semester: 1 }, { unique: true });

export const Result = mongoose.model("Result", ResultSchema);

