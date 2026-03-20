import express from "express";
import { enhancePrompt } from "../services/gemini.js";
import { generateImage } from "../services/huggingface.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Step 1: Enhance prompt
    const enhancedPrompt = await enhancePrompt(prompt);

    console.log("Enhanced Prompt:", enhancedPrompt);

    // Step 2: Generate image
    const imageBuffer = await generateImage(enhancedPrompt);

    res.set("Content-Type", "image/png");
    res.send(imageBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

export default router;