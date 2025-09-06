import express from "express";
import Setting from "../models/setting.js";

const router = express.Router();

// Update work stats
router.post("/", async (req, res) => {
  const { userId, mode, timestamp } = req.body;

  try {
    const setting = await Setting.findOne({ userId });
    if (!setting) return res.status(404).json({ error: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let workStat = setting.workStats.find(
      (stat) => stat.date.setHours(0, 0, 0, 0) === today.getTime()
    );

    if (!workStat) {
      workStat = { date: today, workOnCount: 0, workOffCount: 0, totalWorkHours: 0 };
      setting.workStats.push(workStat);
    }

    if (mode === "on") workStat.workOnCount += 1;
    if (mode === "off") workStat.workOffCount += 1;

    await setting.save();
    res.json(workStat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get today's stats
router.get("/:userId/today", async (req, res) => {
  try {
    const setting = await Setting.findOne({ userId });
    if (!setting) return res.status(404).json({ error: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workStat = setting.workStats.find(
      (stat) => stat.date.setHours(0, 0, 0, 0) === today.getTime()
    );

    res.json(workStat || { workOnCount: 0, workOffCount: 0, totalWorkHours: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
