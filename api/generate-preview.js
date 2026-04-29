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
Create a hyper-realistic premium handmade resin product image.

Product type: ${productType}
Shape: ${shape}
Color theme: ${colorTheme}
Raw materials: ${Array.isArray(rawMaterials) ? rawMaterials.join(", ") : rawMaterials}
Placement: ${placement}
View angle: ${angle}

Customer description:
"${customerDescription}"

Style:
glossy resin finish, premium handmade look, soft pink studio background,
realistic lighting, realistic reflections, elegant resin depth.

Rules:
No watermark, no logo, no human hands, no unwanted text.
`;

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1
      }
    });

    const imageBase64 = response.generatedImages[0].image.imageBytes;

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
