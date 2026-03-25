import express from "express";
import { enhancePrompt } from "../services/gemini.js";
import { generateImage } from "../services/huggingface.js";
import { generateCopy } from "../services/copy.js";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 🔥 1. Enhance prompt
    const enhancedPrompt = await enhancePrompt(prompt);
    console.log("Enhanced Prompt:", enhancedPrompt);

    // 🔥 2. Run image + copy in parallel
    const [imageBuffer, copy] = await Promise.all([
      generateImage(enhancedPrompt),
      generateCopy(prompt)
    ]);

    // 🔥 3. Initialize final image
    let finalImage = imageBuffer;

    // 🔥 4. Add logo and cta overlay (optional)
    try {
  const logo = fs.readFileSync("logo.png");
  const cta = fs.readFileSync("cta.png");

  finalImage = await sharp(imageBuffer)
    .composite([
      {
        input: logo,
        gravity: "southeast"
      },
      {
        input: cta,
        gravity: "southwest"
      }
    ])
    .png()
    .toBuffer();

} catch (err) {
  console.log("Overlay skipped");
}


    // 🔥 5. Send response
    res.json({
      enhancedPrompt,
      image: finalImage.toString("base64"),
      copy
    });

  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Failed to generate ad" });
  }
});

export default router;