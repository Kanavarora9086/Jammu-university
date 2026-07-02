import express from "express";
import { Feedback } from "../models/feedback.model.js";

const router = express.Router();

// Helper function for naive sentiment analysis based on rating
function analyzeSentiment(rating) {
  if (rating >= 4) return "positive";
  if (rating <= 2) return "negative";
  return "neutral";
}

// Submit feedback (public endpoint)
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!rating || !message) {
      return res.status(400).json({ error: "Rating and message are required" });
    }
    const sentiment = analyzeSentiment(rating);
    const feedback = await Feedback.create({ name, email, rating, message, sentiment });
    return res.status(201).json({ data: feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Admin: Get all feedback (protected, admin only)
router.get("/", async (req, res) => {
  try {
    // Assuming admin auth middleware has set req.user.role === "admin"
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    return res.json({ data: feedbacks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

export default router;
