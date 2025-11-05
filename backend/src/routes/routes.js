import express from "express";
import { generateText } from "../controllers/controller.js";
import { generateImage } from "../controllers/image.js";

const router = express.Router();
router.post("/generate-text", generateText);
router.post("/generate-image",generateImage);

export default router;
