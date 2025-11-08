import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateImage = async (req, res) => {
  try {
    const payload = {
      prompt: req.body.prompt || "Lighthouse on a cliff overlooking the ocean",
      output_format: "webp",
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

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
      // Convert image buffer to base64 string
      const base64 = Buffer.from(response.data).toString("base64");
      const dataUri = `data:image/webp;base64,${base64}`;

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: "ai_generated_images",
      });

      return res.status(200).json({
        message: "✅ Image generated and uploaded successfully",
        imageUrl: uploadResponse.secure_url, // HTTPS URL from Cloudinary
      });
    }

    throw new Error(`${response.status}: ${response.data.toString()}`);
  } catch (error) {
    console.error("❌ Image generation error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
