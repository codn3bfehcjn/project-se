import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

console.log("Stability Key Loaded:", process.env.STABILITY_API_KEY ? "✅ Yes" : "❌ No");

export const generateImage = async (req, res) => {
  try {
    const payload = {
      prompt: "Lighthouse on a cliff overlooking the ocean",
      aspect_ratio: "1:1",
      output_format: "jpeg",
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        responseType: "arraybuffer",
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status === 200) {
      const imageBuffer = Buffer.from(response.data);
      fs.writeFileSync("./lighthouse.jpeg", imageBuffer);
      return res.status(200).json({ message: "✅ Image generated", file: "lighthouse.jpeg" });
    }

    throw new Error(`${response.status}: ${response.data.toString()}`);
  } catch (error) {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data.toString());
    } else {
      console.error("❌ General Error:", error.message);
    }
    return res.status(500).json({ error: error.message });
  }
};
