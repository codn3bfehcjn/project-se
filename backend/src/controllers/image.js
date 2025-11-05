import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config()

export const generateImage = async (req, res) => {
  try {
    const payload = {
      prompt: "Lighthouse on a cliff overlooking the ocean",
      output_format: "jpeg",
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
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

      return res.status(200).json({
        message: "Image generated successfully",
        file: "lighthouse.jpeg",
      });
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error("❌ Image generation failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
