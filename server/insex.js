import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const response = await resend.emails.send({
      from: "Mass Mailer <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    res.json({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});