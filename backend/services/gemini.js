export const enhancePrompt = async (userPrompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Create a highly detailed AI image prompt including:
- lighting
- camera angle
- environment
- mood
- colors

Input: ${userPrompt}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    // ✅ SAFE EXTRACTION
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Invalid Gemini response");
    }

    return text;

  } catch (error) {
    console.error("Gemini Error:", error);

    // fallback
    return userPrompt;
  }
};