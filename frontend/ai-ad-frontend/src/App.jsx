import { useState } from "react";
import "./App.css";

function App() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Professional");
  const [cta, setCta] = useState("Shop Now");
  const [ratio, setRatio] = useState("square");

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
          cta,
          ratio
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

        {/* ✅ ADD HERE */}
<select value={ratio} onChange={(e) => setRatio(e.target.value)}>
  <option value="square">Square</option>
  <option value="portrait">Portrait</option>
  <option value="landscape">Landscape</option>
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

  

      {/* 🔥 LOADING */}
      {loading && <p className="loading">Generating AI Ad...</p>}

      {/* 🔥 RESULT (STEP 1 IMPROVED) */}
      {image && (
  <div className="result">

    {/* IMAGE CARD */}
    <div className="image-card">
      <h3>🎯 Generated Ad</h3>

      <img src={image} alt="Generated" />

      <div className="actions">
        <button onClick={downloadImage}>⬇ Download</button>
        <button onClick={() => navigator.clipboard.writeText(copy)}>
          📋 Copy Caption
        </button>
      </div>
    </div>

    {/* PROMPT CARD */}
    <div className="card">
      <h3>✨ Enhanced Prompt</h3>
      <p>{enhancedPrompt}</p>
      <button onClick={copyPrompt}>📋 Copy Prompt</button>
    </div>

    {/* COPY CARD */}
    <div className="card">
      <h3>📢 Caption & Hashtags</h3>

      <p style={{ whiteSpace: "pre-line" }}>{copy}</p>

      <button onClick={() => navigator.clipboard.writeText(copy)}>
        📋 Copy Caption
      </button>
    </div>

  </div>
)}

    </div>
  );
}

export default App;