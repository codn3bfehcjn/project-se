import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

export const generateImage = async (req, res) => {
  try {
    const payload = {
      prompt: req.body.prompt || "Lighthouse on a cliff overlooking the ocean",
      aspect_ratio: "1:1",
      output_format: "jpeg",
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

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
      const imageBase64 = Buffer.from(response.data).toString("base64");
      return res.status(200).json({
        message: "✅ Image generated successfully",
        image: `data:image/jpeg;base64,${imageBase64}`,
      });
    }

    throw new Error(`${response.status}: ${response.data.toString()}`);
  } catch (error) {
    console.error("❌ Error:", error.response?.status || error.message);
    return res.status(500).json({ error: error.message });
  }
};
