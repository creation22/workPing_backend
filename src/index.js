import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cors from "cors";
import settingsRoutes from "./routes/setting.js";
import statsRoutes from "./routes/stats.js";
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

app.use("/api/settings", settingsRoutes);
app.use("/api/stats", statsRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
