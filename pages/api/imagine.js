import axios from "axios";

export default async function handler(req, res) {
  const response = await axios.post(
    "https://api.zeke.ai/imagine/generate",
    req.body,
    {
      headers: {
        Authorization:
          "Bearer 4a82b7d5b4f7e08fb7cd2ac6b3068b7a4ae0db2e9e1f61f773dacd02e699ae9f",
      },
    }
  );
  res.status(200).json({ ...response.data });
}
