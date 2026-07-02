import express from "express";
import { createNotice, getAllNotices } from "../controllers/noticeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllNotices);
router.post("/", protect, adminOnly, createNotice);

export default router;