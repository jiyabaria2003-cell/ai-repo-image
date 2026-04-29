import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://suvicart.in");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const {
      productType = "Resin Tray",
      shape = "Rectangle",
      rawMaterials = [],
      colorTheme = "Pink",
      placement = "Center",
      angle = "Top View",
      customerDescription = ""
    } = req.body || {};

    const prompt = `
Create a realistic premium handmade resin craft product.

Product type: ${productType}
Shape: ${shape}
Color theme: ${colorTheme}
Raw materials: ${Array.isArray(rawMaterials) ? rawMaterials.join(", ") : rawMaterials}
Placement: ${placement}
Camera angle: ${angle}
Customer idea: ${customerDescription}

Make it glossy resin, premium handmade, soft pink studio background, realistic lighting.
No watermark, no logo, no human hands.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [prompt]
    });

    let imageBase64 = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
      throw new Error("No image returned from Gemini");
    }

    return res.status(200).json({
      image: `data:image/png;base64,${imageBase64}`,
      imageUrl: `data:image/png;base64,${imageBase64}`
    });

  } catch (error) {
    console.error("GEMINI ERROR:", error);
    return res.status(500).json({
      error: "Image generation failed",
      message: error.message || String(error)
    });
  }
}
