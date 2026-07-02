import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  sentiment: { type: String, enum: ["positive", "negative", "neutral"], default: "neutral" },
  createdAt: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
