const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");
const rateLimit = require("express-rate-limit");
dotenv.config();

console.log("ENV FILE LOADED");
console.log("API KEY:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.disable("x-powered-by");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lvscommunications.com",
    "https://www.lvscommunications.com"
  ],
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // max 50 requests por IP
});

app.use(limiter);
app.use(express.json());

// 👉 ENDPOINT DEL FORMULARIO
app.post("/api/contact", async (req, res) => {
console.log("BODY:", req.body);
const { name, email, phone, message, captcha } = req.body;

  // 🔒 Validación básica (evita basura)
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ success: false, error: "Invalid email" });
}
if (message.trim().length < 10) {
  return res.status(400).json({ success: false, error: "Message too short" });
}
  try {
   if (!captcha) {
  return res.status(400).json({ success: false, error: "Captcha missing" });
}

const params = new URLSearchParams();
params.append("secret", process.env.RECAPTCHA_SECRET);
params.append("response", captcha);

const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
  method: "POST",
  body: params,
});

const data = await verify.json();

console.log("CAPTCHA VERIFY:", data);

if (!data.success) {
  return res.status(400).json({ success: false, error: "Captcha failed" });
}

await resend.emails.send({
from: "LVS Communications <contact@lvscommunications.com>",
    to: ["diego@lvscommunications.com"],
  subject: "New Contact Form",
  html: `
    <h2>New message from website</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
});

    res.json({ success: true });
  } catch (err) {
    console.error(err);
res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
