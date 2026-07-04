import { Router } from "express";
import { Feedback } from "../models/feedback.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const feedbackRouter = Router();

// Helper function for naive sentiment analysis based on rating
function analyzeSentiment(rating) {
  if (rating >= 4) return "positive";
  if (rating <= 2) return "negative";
  return "neutral";
}

// Submit feedback (public endpoint)
feedbackRouter.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!rating || !message) {
      return res.status(400).json({ ok: false, error: { message: "Rating and message are required" } });
    }
    const sentiment = analyzeSentiment(Number(rating));
    const feedback = await Feedback.create({ name, email, rating: Number(rating), message, sentiment });
    return res.status(201).json({ ok: true, data: feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: { message: "Failed to submit feedback" } });
  }
});

// Admin: Get all feedback (protected — admin only)
feedbackRouter.get("/", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, data: feedbacks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: { message: "Failed to fetch feedback" } });
  }
});
