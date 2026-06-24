// server.js
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = 5000;

// Initialize Resend with your API key
const resend = new Resend('re_hb2uX43D_C8FRiSvDUvn9pddixbu9mN41'); // Replace with your actual API key

app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, html'
      });
    }

    // const { data, error } = await resend.emails.send({
    //   from: 'Your App <onboarding@resend.dev>',
    //   to: [to],
    //   subject: subject,
    //   html: html,
    // });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
});