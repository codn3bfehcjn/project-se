import express from "express";
import cors from "cors";
import aiRoutes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/check", (req, res) => res.send("Backend is running"));
app.use("/api", aiRoutes);

export default app;
