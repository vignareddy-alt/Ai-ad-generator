export const generateImage = async (prompt) => {
  try {
    // 🔥 Improve prompt for better quality
    const improvedPrompt = `
ultra realistic, 4k, high detail, sharp focus, cinematic lighting,
professional photography, detailed textures,
${prompt}
`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: improvedPrompt,
          options: {
            wait_for_model: true,
          },
          parameters: {
            negative_prompt:
              "blurry, low quality, distorted, bad anatomy, pixelated, watermark, text",
          }
        })
      }
    );

    console.log("HF Status:", response.status);

    // 🔥 Handle model loading (very common)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF ERROR:", errorText);

      if (errorText.includes("loading")) {
        console.log("Model loading... retrying in 5s");
        await new Promise((res) => setTimeout(res, 5000));
        return generateImage(prompt); // retry
      }

      throw new Error("HuggingFace failed");
    }

    const buffer = await response.arrayBuffer();

    console.log("Image buffer size:", buffer.byteLength);

    if (buffer.byteLength === 0) {
      throw new Error("Empty image received");
    }

    return Buffer.from(buffer);

  } catch (err) {
    console.error("Image Generation Error:", err);
    throw err;
  }
};