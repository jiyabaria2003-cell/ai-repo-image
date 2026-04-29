import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

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
Create a hyper-realistic premium handmade resin product image.

Product type: ${productType}
Shape: ${shape}
Color theme: ${colorTheme}
Materials: ${Array.isArray(rawMaterials) ? rawMaterials.join(", ") : rawMaterials}
Placement: ${placement}
Angle: ${angle}

Customer description:
"${customerDescription}"

Style:
- glossy resin finish
- soft pink studio background
- premium handmade look
- realistic lighting and reflections

Rules:
- no watermark
- no logo
- no text unless requested
- no human hands
`;

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: { numberOfImages: 1 }
    });

    const image = response.generatedImages[0].image.imageBytes;

    return res.status(200).json({
      image: `data:image/png;base64,${image}`
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "failed" });
  }
}
