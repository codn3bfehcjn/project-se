import React from 'react'; 
import { useState } from 'react';
import { Wand2, FileText, Loader2, Download, Copy, Check, ImageIcon, Sparkles, Zap, ChevronRight } from 'lucide-react';

export default function AICreatorApp() {
  const [activeTab, setActiveTab] = useState('writer');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult('');
    setImageUrl('');

    try {
      const endpoint = activeTab === 'writer' ? '/api/generate-text' : '/api/generate-image';
      
      const response = await fetch(`https://project-se-1.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log(data);
      if (activeTab === 'writer') {
        setResult(data.text || 'Generated content will appear here...');
      } else {
        setImageUrl(data.imageUrl || '');
      }
    } catch (error) {
      console.error('Error:', error);
      if (activeTab === 'writer') {
        setResult('Error generating content. Please check your backend connection.');
      } else {
        alert('Error generating image. Please check your backend connection.');
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
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.png';
    link.click();
  };

  const examplePrompts = activeTab === 'writer' 
    ? [
        'Write a compelling product description for eco-friendly water bottles',
        'Create a motivational story about overcoming challenges',
        'Draft a professional email for a job application'
      ]
    : [
        'A serene Japanese garden with cherry blossoms at sunset',
        'Cyberpunk city street with neon lights and rain',
        'Minimalist modern workspace with plants and natural light'
      ];

  const setExamplePrompt = (example) => {
    setPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4backdrop-blur-sm px-6 py-3 shadow-lg">
            
            <h1 className="text-5xl font-extrabold bg-green-400 bg-clip-text text-transparent">
              AI Creator Studio
            </h1>
          </div>
          <p className="text-green-500 text-lg font-medium">Unleash your creativity with AI-powered content generation</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600">
           
           
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/50">
            <button
              onClick={() => setActiveTab('writer')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 font-semibold ${
                activeTab === 'writer'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm font-bold">AI Writer</div>
                <div className={`text-xs ${activeTab === 'writer' ? 'text-purple-100' : 'text-gray-500'}`}>
                  Generate text content
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 font-semibold ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ImageIcon className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm font-bold">Image Generator</div>
                <div className={`text-xs ${activeTab === 'image' ? 'text-pink-100' : 'text-gray-500'}`}>
                  Create stunning images
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto ">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            {/* Enhanced Input Section */}
            <div className="p-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 "></div>
              <div className="relative z-10">
                <label className="block text-white font-bold mb-4 text-lg flex items-center gap-2">
                  
                  {activeTab === 'writer' ? 'What would you like to write about?' : 'Describe the image you want to create'}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder={
                      activeTab === 'writer'
                        ? 'E.g., Write a blog post about space exploration...'
                        : 'E.g., A futuristic city with flying cars...'
                    }
                    className="flex-1 px-5 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/50 focus:outline-none text-white text-lg shadow-xl font-extrabold"
                    disabled={loading}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-2xl hover:scale-105 transform"
                  >
                    {loading ? (
                      <>
                        
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                      
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Example Prompts */}
                <div className="mt-5">
                  <p className="text-white/90 text-md font-medium mb-2 flex items-center gap-2">
                    
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setExamplePrompt(example)}
                        className="text-md bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg backdrop-blur-sm transition-all flex items-center gap-1 transform"
                      >
                        <span className="truncate max-w-xs">{example}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="p-8">
              {activeTab === 'writer' ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                   
                    {result && !loading && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:scale-105 transform"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied to Clipboard!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Text to your Clipboard
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="min-h-80 p-8 rounded-2xl border border-gray-700 shadow-inner">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-80 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                        <p className="text-gray-600 font-medium">Crafting your content...</p>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    ) : result ? (
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{result}</p>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-80 text-center">
                        <FileText className="w-20 h-20 text-gray-300 mb-4" />
                        <p className="text-black text-lg font-medium">Your generated content will appear here</p>
                        <p className="text-black text-sm mt-2">Enter a prompt above and click Generate to start</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-pink-600" />
                      Generated Image
                    </h3>
                    {imageUrl && !loading && (
                      <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:scale-105 transform"
                      >
                        <Download className="w-4 h-4" />
                        Download Image
                      </button>
                    )}
                  </div>
                  <div className="min-h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-inner overflow-hidden">
                    {loading ? (
                      <div className="flex flex-col items-center gap-5">
                        <div className="relative">
                          <Loader2 className="w-16 h-16 animate-spin text-pink-600" />
                          <Sparkles className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <p className="text-gray-600 font-medium text-lg">Creating your masterpiece...</p>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Generated" className="max-w-full max-h-96 object-contain rounded-xl shadow-2xl" />
                    ) : (
                      <div className="text-center p-12">

                        <p className="text-gray-400 text-lg font-medium">Your generated image will appear here</p>
                        <p className="text-gray-400 text-sm mt-2">Describe what you want to see and click Generate</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Info Card */}
          
        </div>
      </div>
    </div>
  );
}