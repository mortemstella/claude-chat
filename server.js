const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20240620";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({
      error: "Missing ANTHROPIC_API_KEY. Set it in your environment before starting the server."
    });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const text = Array.isArray(data.content)
      ? data.content.map((part) => part.text).join("")
      : "";

    return res.json({ text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/config", (req, res) => {
  res.json({ model });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Claude chat server running on http://localhost:${port}`);
});
