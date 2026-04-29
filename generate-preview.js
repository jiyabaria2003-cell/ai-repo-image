import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors({
  origin: "https://suvicart.in"
}));

app.use(express.json({ limit: "5mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/generate-preview", async (req, res) => {
  try {
    const {
      productType,
      shape,
      rawMaterials,
      colorTheme,
      placement,
      angle,
      customerDescription
    } = req.body;

    const prompt = `
Create a hyper-realistic premium product preview image for a handmade custom resin craft product.

Product type: ${productType}
Shape: ${shape}
Color theme: ${colorTheme}
Selected raw materials: ${rawMaterials.join(", ")}
Decoration placement: ${placement}
Requested camera angle: ${angle}

Customer description, preserve the meaning exactly even if written in any language:
"${customerDescription}"

Design rules:
- Create a realistic handmade resin product.
- Materials must look embedded inside resin or properly attached depending on product type.
- Dried flowers, pearls, glitter, foil, shells, stones, pigments, acrylic names, and miniatures should look natural and premium.
- Follow the selected placement carefully.
- Keep the design elegant, balanced, and not overcrowded.
- Use glossy resin depth, realistic reflections, soft shadows, and premium studio lighting.
- Use a soft pastel pink or neutral background.
- Do not add text unless customer specifically requested text or name.
- No watermark, no logo, no human hands, no unrelated objects.
`;

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1
      }
    });

    const imageBase64 = response.generatedImages[0].image.imageBytes;

    res.json({
      image: `data:image/png;base64,${imageBase64}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Image generation failed"
    });
  }
});

app.listen(process.env.PORT || 3000);