import React, { useState } from "react";
import {
  FileText,
  Loader2,
  Download,
  Copy,
  Check,
  ImageIcon,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function AICreatorApp() {
  const [activeTab, setActiveTab] = useState("writer");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    setImageUrl("");

    try {
      const endpoint =
        activeTab === "writer"
          ? "/api/generate-text"
          : "/api/generate-image";

      const response = await fetch(
        `https://project-se-1.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server Error (${response.status}): ${text}`);
      }

      const data = await response.json();

      if (activeTab === "writer") {
        setResult(data.text || "No text generated.");
      } else {
        const base64 = data.image;
        if (base64 && base64.startsWith("data:image")) {
          setImageUrl(base64);
        } else {
          throw new Error("Invalid image response from server.");
        }
      }
    } catch (error) {
      console.error("❌ Fetch error:", error.message);
      if (activeTab === "writer") {
        setResult("Error generating content. Check your backend connection.");
      } else {
        alert("Error generating image. Please check your backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-image.jpeg";
    link.click();
  };

  const examplePrompts =
    activeTab === "writer"
      ? [
          "Write a compelling product description for eco-friendly water bottles",
          "Create a motivational story about overcoming challenges",
          "Draft a professional email for a job application",
        ]
      : [
          "A serene Japanese garden with cherry blossoms at sunset",
          "Cyberpunk city street with neon lights and rain",
          "Minimalist modern workspace with plants and natural light",
        ];

  const setExamplePrompt = (example) => setPrompt(example);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Creator Studio
        </h1>
        <p className="text-purple-600 mt-2 text-lg font-medium">
          Generate content and visuals with AI
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-8 flex bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => setActiveTab("writer")}
          className={`flex-1 py-4 font-semibold transition ${
            activeTab === "writer"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          AI Writer
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 py-4 font-semibold transition ${
            activeTab === "image"
              ? "bg-pink-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Image Generator
        </button>
      </div>

      {/* Input */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <label className="block mb-3 font-bold text-lg text-gray-700">
          {activeTab === "writer"
            ? "What would you like to write about?"
            : "Describe the image you want to create"}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
            className="flex-1 px-5 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder={
              activeTab === "writer"
                ? "E.g., Write a blog about the future of AI..."
                : "E.g., A mountain sunrise in cyberpunk style..."
            }
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Example Prompts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {examplePrompts.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setExamplePrompt(example)}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl p-8 shadow-xl">
        {activeTab === "writer" ? (
          <>
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                <p className="text-gray-500">Crafting your text...</p>
              </div>
            ) : result ? (
              <>
                <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
                  {result}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Text
                    </>
                  )}
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-center">
                Your generated content will appear here.
              </p>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                <p className="text-gray-500">Creating your image...</p>
              </div>
            ) : imageUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="max-w-full rounded-xl shadow-lg mb-4"
                />
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Your generated image will appear here.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
