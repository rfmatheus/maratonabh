import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔹 Endpoint: buscar corridas (RunSignUp API)
app.get("/races", async (req, res) => {
  const country = req.query.country || "US";
  try {
    const api = `https://runsignup.com/Rest/races?format=json&country=${country}`;
    const response = await fetch(api);
    const data = await response.json();

    const races = (data.races || []).map(r => ({
      name: r.race.name,
      date: r.race.next_date,
      location: `${r.race.city}, ${r.race.state}`
    }));

    res.json({ races });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar corridas" });
  }
});

// 🔹 Endpoint: caixa de IA (OpenAI API)
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar IA" });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
