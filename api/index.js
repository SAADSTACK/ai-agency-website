const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API: Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and message are required.' 
    });
  }

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

module.exports = app;
