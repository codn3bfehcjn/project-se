import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./src/routes/routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", aiRoutes);
app.get("/check", (req, res) => res.send("Backend is running")),console.log("ping recieved");
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
});
