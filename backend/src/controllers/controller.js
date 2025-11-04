import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.toString().trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OpenRouter API key not configured" });
    }

    const payload = {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 400
    };

    const response = await axios.post(OPENROUTER_URL, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 60_000
    });

   
    const text =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.output ||
      response.data?.result ||
      null;

    if (!text) {
      return res
        .status(502)
        .json({ error: "No text returned from provider", details: response.data });
    }

    return res.json({ success: true, model: payload.model, text });
  } catch (err) {
    console.error("OpenRouter API Error:", err.response?.data || err.message);

    const details = err.response?.data || err.message;
    return res.status(500).json({ error: "Failed to generate text", details });
  }
};
