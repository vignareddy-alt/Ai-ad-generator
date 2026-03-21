export const generateImage = async (prompt) => {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/stabilityai/sdxl-turbo ",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
    negative_prompt: "blurry, low quality, distorted, bad anatomy, pixelated",
  }
      })
    }
  );

  console.log("HF Status:", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error("HF ERROR:", error);
    throw new Error("HuggingFace failed");
  }

  const buffer = await response.arrayBuffer();

  console.log("Image buffer size:", buffer.byteLength);

  return Buffer.from(buffer);
};