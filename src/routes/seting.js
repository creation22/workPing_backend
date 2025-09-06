import express from "express";
import Setting from "../models/Setting.js";

const router = express.Router() ; 

/// adding or updating user setings
router.post('/' , async (req , res) => {
    const {userId , chatIds , workOnMessage , sendSummary  , workOffMessage } = req.body ;
    try { 
        const existing = await Setting.findOne({userId}) ; 

        if(existing) {
            existing.chatIds = chatIds ;
            existing.workOnMessage = workOnMessage ;
            existing.workOffMessage = workOffMessage ;
            existing.sendSummary = sendSummary ;
            await existing.save() ; 
            return res.status(200).json(existing) ; 
        }
        else { 
            const newSetting = await Setting.create({ userId , chatIds , workOnMessage , sendSummary  , workOffMessage }) ;
            return res.status(201).json(newSetting) ; 
        }
    } catch (error) {
        console.error("Error updating settings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/:userId", async (req, res) => {
  try {
    const setting = await Setting.findOne({ userId: req.params.userId });
    if (!setting) return res.status(404).json({ error: "Settings not found" });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router ; 
