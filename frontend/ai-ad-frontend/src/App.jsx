import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);

    const response = await fetch("http://localhost:5000/api/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    setImage(imageUrl);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>AdVantage Gen</h1>

      <input
        type="text"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generateImage}>
        Generate Image
      </button>

      {loading && <p>Generating...</p>}

      {image && <img src={image} alt="Generated" width="400" />}
    </div>
  );
}

export default App;