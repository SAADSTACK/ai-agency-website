const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API: Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body;
  
  // Validate
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and message are required.' 
    });
  }

  // In production, integrate with email service (Nodemailer, SendGrid, etc.)
  console.log('New contact form submission:', { name, email, company, message });
  
  res.json({ 
    success: true, 
    message: 'Thank you for your inquiry! Our team will respond within 24 hours.' 
  });
});

// API: Newsletter subscription
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  console.log('New subscriber:', email);
  res.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
});

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'public', 'services.html')));
app.get('/insights', (req, res) => res.sendFile(path.join(__dirname, 'public', 'insights.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// Catch-all for clean URLs
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`✨ Node and Nexus Ai running at http://localhost:${PORT}`);
});
