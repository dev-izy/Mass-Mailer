// server/mock-server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Simplified CORS for Express 5
app.use(cors({
  origin: true, // Allow all origins (for development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Mass Mailer Mock Server',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      sendEmail: 'POST /send-email'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock email server is running',
    timestamp: new Date().toISOString()
  });
});

// Send email endpoint (mock - just logs)
app.post('/send-email', async (req, res) => {
  console.log('\n📧 ===== MOCK EMAIL =====');
  console.log('To:', req.body.to);
  console.log('Subject:', req.body.subject);
  console.log('HTML preview:', req.body.html?.substring(0, 100) + '...');
  console.log('📧 ======================\n');
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  res.json({ 
    success: true, 
    message: 'Mock email sent (logged to console)',
    email: req.body
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mock email server running on http://localhost:${PORT}`);
  console.log(`📧 Emails will be logged to console (not actually sent)`);
  console.log(`📍 Try: http://localhost:${PORT}/health`);
});