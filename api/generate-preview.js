export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://suvicart.in");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  return res.status(200).json({
    imageUrl: "https://dummyimage.com/900x600/f7c5cc/8f244e&text=AI+Preview",
    image: "https://dummyimage.com/900x600/f7c5cc/8f244e&text=AI+Preview"
  });
}
