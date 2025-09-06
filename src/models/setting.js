import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    userId: {
      type: String,
      default: uuidv4, // automatically generate a UUID
      unique: true,
      required: true,
    },
    chatIds: [
      {
        chatId: { type: String, required: true },
        label: { type: String, default: "General" },
      },
    ],
    workOnMessage: {
      type: String,
      default: "I’ve started working!",
    },
    workOffMessage: {
      type: String,
      default: "I’ve stopped working!",
    },
    sendSummary: {
      type: Boolean,
      default: false,
    },
    workStats: [
      {
        date: { type: Date, default: Date.now },
        workOnCount: { type: Number, default: 0 },
        workOffCount: { type: Number, default: 0 },
        totalWorkHours: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// avoid OverwriteModelError
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting;
