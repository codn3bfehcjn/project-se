import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

// Ensure the folder exists
const generatedDir = path.join(process.cwd(), "generated");
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir);

export const generateImage = async (req, res) => {
  try {
    const prompt = req.body.prompt || "Lighthouse on a cliff overlooking the ocean";

    const payload = {
      prompt,
      output_format: "webp",
    };

    const response = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      axios.toFormData(payload, new FormData()),
      {
        responseType: "arraybuffer",
        validateStatus: () => true,
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status === 200) {
      const timestamp = Date.now();
      const imageName = `image_${timestamp}.webp`;
      const imagePath = path.join(generatedDir, imageName);

      // Save file
      fs.writeFileSync(imagePath, Buffer.from(response.data));

      // Use Render’s HTTPS domain dynamically
      const baseUrl = process.env.RENDER_EXTERNAL_URL || "http://localhost:5000";
      const imageUrl = `${baseUrl}/generated/${imageName}`;

      console.log(`✅ Image generated: ${imageUrl}`);

      return res.status(200).json({
        message: "✅ Image generated successfully",
        imageUrl,
      });
    }

    throw new Error(`${response.status}: ${response.data.toString()}`);
  } catch (error) {
    console.error("❌ Image generation error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
