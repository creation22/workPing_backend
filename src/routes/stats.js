import express from "express";
import Setting from "../models/setting.js";

const router = express.Router();

// Helper to get today's date at midnight
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// POST: Update work stats
router.post("/", async (req, res) => {
  const { userId, mode, timestamp } = req.body;

  try {
    const setting = await Setting.findOne({ userId });
    if (!setting) return res.status(404).json({ error: "User not found" });

    const today = getToday();

    // Find or create today's workStat
    let workStat = setting.workStats.find(
      (stat) => new Date(stat.date).toDateString() === today.toDateString()
    );

    if (!workStat) {
      workStat = { date: today, workOnCount: 0, workOffCount: 0, totalWorkHours: 0 };
      setting.workStats.push(workStat);
    }

    // Only update if mode is different from currentMode
    if (mode !== setting.currentMode) {
      const now = timestamp ? new Date(timestamp) : new Date();

      if (mode === "on") {
        workStat.workOnCount += 1;
        // Mark when work started
        setting.lastModeChange = now;
      }

      if (mode === "off") {
        workStat.workOffCount += 1;
        // Calculate duration of work session in hours
        if (setting.lastModeChange) {
          const durationMs = now - new Date(setting.lastModeChange);
          const durationHrs = durationMs / (1000 * 60 * 60); // convert ms to hours
          workStat.totalWorkHours += durationHrs;
          setting.lastModeChange = null;
        }
      }

      // Update current mode
      setting.currentMode = mode;
      await setting.save();
    }

    res.status(200).json(workStat);
  } catch (err) {
    console.error("Error updating stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Get today's stats
router.get("/:userId/today", async (req, res) => {
  const { userId } = req.params;

  try {
    const setting = await Setting.findOne({ userId });
    if (!setting) return res.status(404).json({ error: "User not found" });

    const today = getToday();
    const workStat = setting.workStats.find(
      (stat) => new Date(stat.date).toDateString() === today.toDateString()
    );

    res.status(200).json(
      workStat || { workOnCount: 0, workOffCount: 0, totalWorkHours: 0 }
    );
  } catch (err) {
    console.error("Error fetching today's stats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
