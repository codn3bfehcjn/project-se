import express from "express";
import cors from "cors";
import aiRoutes from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/generated", express.static("public/generated"));
app.use("/api", aiRoutes);

export default app;
