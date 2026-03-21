export const generateCopy = async (prompt, tone = "Professional") => {
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
Generate a social media ad.

Product: ${prompt}
Tone: ${tone}

Give output in this format:
Caption:
Hashtags:
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No copy generated";

  } catch (err) {
    console.error(err);
    return "Copy generation failed";
  }
};