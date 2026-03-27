const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
const JWT_EXPIRY = '7d';

// In-memory user database (Replace with MongoDB/PostgreSQL in production)
const users = new Map();
let userIdCounter = 1;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ═══ AUTHENTICATION MIDDLEWARE ═══
function verifyToken(req, res, next) {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

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

// ═══ AUTHENTICATION ENDPOINTS ═══

// API: User Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, company, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Full name, email, and password are required.' 
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email already exists.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = userIdCounter++;
    const user = {
      id: userId,
      fullName,
      email,
      company: company || '',
      password: hashedPassword,
      createdAt: new Date()
    };

    users.set(userId, user);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      token,
      message: 'Account created successfully!',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        company: user.company
      }
    });

    console.log('New user registered:', email);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

// API: User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.' 
      });
    }

    // Find user
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      message: 'Login successful!',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        company: user.company
      }
    });

    console.log('User logged in:', email);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

// API: User Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true, message: 'Logged out successfully!' });
});

// API: Get Current User
app.get('/api/auth/me', verifyToken, (req, res) => {
  try {
    const user = users.get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
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

// Serve stitch screens static files
app.use('/stitch-screens', express.static(path.join(__dirname, 'stitch-screens')));

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'public', 'services.html')));
app.get('/insights', (req, res) => res.sendFile(path.join(__dirname, 'public', 'insights.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/blog', (req, res) => res.sendFile(path.join(__dirname, 'stitch-screens', 'ai-agency-blog', 'blog.html')));

// Auth Routes
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));

// Protected Dashboard Route
app.get('/dashboard', (req, res) => {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } catch (error) {
    res.redirect('/login');
  }
});

// Catch-all for clean URLs
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════╗`);
  console.log(`║  ✨ Node and Nexus Ai running at         ║`);
  console.log(`║  http://localhost:${PORT}      ║`);
  console.log(`║                                           ║`);
  console.log(`║  🔐 Authentication System: ACTIVE        ║`);
  console.log(`║  📊 Dashboard: /dashboard                ║`);
  console.log(`║  🔑 Login: /login | Signup: /signup      ║`);
  console.log(`╚═══════════════════════════════════════════╝\n`);
});
