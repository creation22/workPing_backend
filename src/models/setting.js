import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    userId: { type: String, default: uuidv4, unique: true, required: true },
    chatIds: [{ chatId: String, label: { type: String, default: "General" } }],
    workOnMessage: { type: String, default: "I’ve started working!" },
    workOffMessage: { type: String, default: "I’ve stopped working!" },
    sendSummary: { type: Boolean, default: false },
    currentMode: { type: String, enum: ["on", "off"], default: "off" },
    lastModeChange: { type: Date, default: null },
    workStats: [
      { date: Date, workOnCount: Number, workOffCount: Number, totalWorkHours: Number }
    ],
  },
  { timestamps: true }
);


// avoid OverwriteModelError
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting;
