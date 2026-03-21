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

    // 1. Enhance prompt
    const enhancedPrompt = await enhancePrompt(prompt);

    // 2. Run in parallel
    const [imageBuffer, copy] = await Promise.all([
      generateImage(enhancedPrompt),
      generateCopy(prompt)
    ]);

    // 3. Add logo (optional)
    let finalImage = imageBuffer;

    try {
      const logo = fs.readFileSync("logo.png");

      finalImage = await sharp(imageBuffer)
        .composite([
          {
            input: logo,
            gravity: "southeast"
          }
        ])
        .png()
        .toBuffer();

    } catch {
      console.log("Logo not found, skipping overlay");
    }

    // 4. Send response
    res.json({
      enhancedPrompt,
      image: finalImage.toString("base64"),
      copy
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed" });
  }
});

export default router;