const express = require("express");
const axios = require("axios");
require("dotenv").config();
const twilio = require("twilio");

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post("/webhook", async (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;

  const openaiRes = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: incomingMsg }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const reply = openaiRes.data.choices[0].message.content;

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: `🤖 *Sasiya AI ChatGPT*: \n${reply}`,
    from: "whatsapp:+12512908599", // Twilio sandbox number
    to: from,
  });

  res.sendStatus(200);
});

app.listen(3000, () => console.log("🚀 Sasiya AI running on port 3000"));
