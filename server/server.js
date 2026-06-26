// server/server.js
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Resend with your API key
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_fc7xCAh6_5nefmct3NkK3dszyuPbtVTxC';
const resend = new Resend(RESEND_API_KEY);

// CORS configuration - simplified for Express 5
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://*.github.dev',
    'https://*.codespaces.app',
    'https://*.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// REMOVED: app.options('*', cors()); - This causes the error in Express 5

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Mass Mailer Email Server',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      sendEmail: 'POST /send-email',
      testEmail: 'POST /test-email'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Email server is running',
    timestamp: new Date().toISOString()
  });
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
  console.log('📧 Send email request received:', req.body);
  
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields: to, subject, html'
      });
    }

    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
      from: 'Mass Mailer <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Email sent successfully:', data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint for Resend
app.post('/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    
    const { data, error } = await resend.emails.send({
      from: 'Mass Mailer <onboarding@resend.dev>',
      to: [to || 'test@example.com'],
      subject: 'Test Email from Mass Mailer',
      html: '<h1>Test Email</h1><p>If you received this, your Resend setup is working!</p>',
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Email server running on http://localhost:${PORT}`);
  console.log(`📧 Ready to send emails via Resend`);
  console.log(`🔑 Resend API Key: ${RESEND_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`📍 Try: http://localhost:${PORT}/health`);
});