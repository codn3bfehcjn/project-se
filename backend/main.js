import express from "express";
import path from "node:path";

const app = express();
app.use(express.json());

// Serve generated images
app.use("/generated", express.static(path.join(process.cwd(), "generated")));

// Import route
import { generateImage } from "./controllers/generateImage.js";
app.post("/api/generate-image", generateImage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
