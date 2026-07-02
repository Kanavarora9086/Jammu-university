import { Notice } from "../models/Notice.js";

export const createNotice = async (req, res) => {
  const { title, body, audience } = req.body;

  try {
    const notice = await Notice.create({
      title,
      body,
      audience: audience || "all",
      publishedByAdminId: req.user._id
    });

    res.status(201).json({ ok: true, notice });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ ok: true, notices });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};