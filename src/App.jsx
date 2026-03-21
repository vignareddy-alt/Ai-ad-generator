import { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return alert("Enter a prompt");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/image/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const contentType = response.headers.get("content-type");

      // ✅ Case 1: Backend returns JSON (base64)
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        setEnhancedPrompt(data.enhancedPrompt || "");
        setImage(`data:image/png;base64,${data.image}`);
      }

      // ✅ Case 2: Backend returns image (blob)
      else {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        setImage(imageUrl);
        setEnhancedPrompt("Generated from AI");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    alert("Copied!");
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "advantage-gen.png";
    link.click();
  };

  return (
    <div className="container">

      <h1>🚀 AdVantage Gen</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter your ad idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={generateImage}>
          Generate
        </button>
      </div>

      {loading && <p className="loading">Generating AI content...</p>}

      {image && (
        <div className="result">

          <img src={image} alt="Generated" />

          <div className="actions">
            <button onClick={downloadImage}>⬇ Download</button>
          </div>

          <div className="prompt-box">
            <h3>✨ Enhanced Prompt</h3>
            <p>{enhancedPrompt}</p>
            <button onClick={copyPrompt}>📋 Copy</button>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;