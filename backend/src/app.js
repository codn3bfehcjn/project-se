import express from "express";
import cors from "cors";
import aiRoutes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "OpenRouter AI Backend" }));
app.use("/api", aiRoutes);

export default app;
