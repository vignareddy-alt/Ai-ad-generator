import express from "express";
import { enhancePrompt } from "../services/gemini.js";
import { generateImage } from "../services/huggingface.js";
import { generateCopy } from "../services/copy.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

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

    // 🔥 2. Generate image + copy
    const [imageBuffer, copy] = await Promise.all([
      generateImage(enhancedPrompt),
      generateCopy(prompt)
    ]);

    console.log("Image buffer size:", imageBuffer?.length);

    // ❌ Check if image is valid
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Image not generated");
    }

    let finalImage = imageBuffer;

    // 🔥 3. Overlay logo + CTA
    try {
      const logoPath = path.join(process.cwd(), "backend", "logo.png");
      const ctaPath = path.join(process.cwd(), "backend", "ctabutton.png");

      const logo = fs.readFileSync("logo.png");
const cta = fs.readFileSync("cta.png");

// 🔥 Resize properly
const resizedLogo = await sharp(logo)
  .resize(120) // adjust if needed
  .png()
  .toBuffer();

const resizedCTA = await sharp(cta)
  .resize(220) // bigger CTA
  .png()
  .toBuffer();

// 🔥 Add spacing from edges
finalImage = await sharp(imageBuffer)
  .composite([
    {
      input: resizedLogo,
      gravity: "southeast",
      top: 20,
      left: 20
    },
    {
      input: resizedCTA,
      gravity: "southwest",
      top: 20,
      left: 20
    }
  ])
  .png()
  .toBuffer();

      console.log("Overlay applied");

    } catch (err) {
      console.log("Overlay skipped:", err.message);
    }

    // 🔥 4. Convert to base64
    const base64Image = finalImage.toString("base64");

    console.log("Base64 length:", base64Image.length);

    // 🔥 5. Send response
    res.json({
      enhancedPrompt,
      image: base64Image,
      copy
    });

  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Failed to generate ad" });
  }
});

export default router;