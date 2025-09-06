import express from "express";
import Setting from "../models/setting.js";

const router = express.Router(); 

// Add or update user settings
router.post("/", async (req, res) => {
  const { userId, chatIds, workOnMessage, workOffMessage, sendSummary } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Find existing setting or create a new one
    const updatedSetting = await Setting.findOneAndUpdate(
      { userId },
      { chatIds, workOnMessage, workOffMessage, sendSummary },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updatedSetting);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get settings for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const setting = await Setting.findOne({ userId: req.params.userId });
    if (!setting) return res.status(404).json({ error: "Settings not found" });
    res.json(setting);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
