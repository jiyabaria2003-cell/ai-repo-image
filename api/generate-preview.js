export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { prompt } = req.body;

    console.log("PROMPT:", prompt);

    // TEMP FIX: return dummy image so frontend works
    return res.status(200).json({
      imageUrl: "https://dummyimage.com/600x400/f7c5cc/000&text=AI+Preview"
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
