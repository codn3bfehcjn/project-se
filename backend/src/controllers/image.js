import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

export const generateImage = async (req, res) => {
  try {
    const payload = {
      prompt: "Lighthouse on a cliff overlooking the ocean",
      output_format: "webp",
    };

    const response = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      axios.toFormData(payload, new FormData()),
      {
        responseType: "arraybuffer", // image binary data
        validateStatus: () => true,  // accept all statuses
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    // Log status and type of response
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data type:", typeof response.data, "Length:", response.data.byteLength);

    if (response.status === 200) {
      // Optionally save to inspect
      fs.writeFileSync("./debug_image.webp", Buffer.from(response.data));
      console.log("✅ Image written to debug_image.webp");

      return res
        .status(200)
        .json({ message: "✅ Image generated", note: "Saved locally as debug_image.webp" });
    } else {
      console.error("❌ Error:", response.status, response.data.toString());
      return res.status(response.status).json({
        error: `${response.status}: ${response.data.toString()}`,
      });
    }
  } catch (error) {
    console.error("❌ Exception:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
