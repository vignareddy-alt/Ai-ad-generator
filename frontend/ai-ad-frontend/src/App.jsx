import { useState } from "react";
import "./App.css";

function App() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Professional");
  const [cta, setCta] = useState("Shop Now");

  const [image, setImage] = useState(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [copy, setCopy] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!product) return alert("Please enter product");

    setLoading(true);
    setImage(null);

    try {
      const response = await fetch("http://localhost:5000/api/image/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: product,
          audience,
          platform,
          tone,
          cta
        })
      });

     const data = await response.json();

setEnhancedPrompt(data.enhancedPrompt);
setImage(`data:image/png;base64,${data.image}`);
setCopy(data.copy); // 🔥 IMPORTANT

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    alert("Prompt copied!");
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "advantage-gen.png";
    link.click();
  };

  return (
    <div className="container">

      {/* 🔥 TITLE */}
      <h1>🚀 AdVantage Gen</h1>

      <p className="tagline">
        AI-powered Ad Creative Generator using Gemini & Stable Diffusion
      </p>

      {/* 🔥 INPUT FORM (UPDATED - STEP 5) */}
      <div className="input-box column">

        <input
          type="text"
          placeholder="Product (e.g. Eco coffee cup)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <input
          type="text"
          placeholder="Target Audience (e.g. Students)"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>Instagram</option>
          <option>LinkedIn</option>
        </select>

        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option>Professional</option>
          <option>Witty</option>
          <option>Inspirational</option>
          <option>Urgent</option>
        </select>

        <input
          type="text"
          placeholder="CTA (e.g. Shop Now)"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
        />

        <button onClick={generateImage}>
          Generate Ad
        </button>

      </div>

      {/* 🔥 FEATURES */}
      <div className="features">
        <h3>✨ Features</h3>
        <ul>
          <li>AI Prompt Enhancement (Gemini)</li>
          <li>Image Generation (Stable Diffusion)</li>
          <li>Download Generated Ads</li>
          <li>Copy AI Prompt</li>
        </ul>
      </div>

      {/* 🔥 LOADING */}
      {loading && <p className="loading">Generating AI Ad...</p>}

      {/* 🔥 RESULT (STEP 1 IMPROVED) */}
      {image && (
        <div className="result">

          {/* IMAGE */}
          <img src={image} alt="Generated" />

          {/* DOWNLOAD */}
          <div className="actions">
            <button onClick={downloadImage}>⬇ Download</button>
          </div>

          {/* ENHANCED PROMPT */}
          <div className="prompt-box">
            <h3>✨ Enhanced Prompt</h3>
            <p>{enhancedPrompt}</p>
            <button onClick={copyPrompt}>📋 Copy</button>
          </div>

          
          {/* COPYWRITING */}
        <div className="copy-box">
          <h3>📢 Caption & Hashtags</h3>
          <p>{copy}</p>
            </div>

        </div>
      )}

    </div>
  );
}

export default App;