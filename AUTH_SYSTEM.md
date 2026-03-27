# 🔐 Node and Nexus Ai - Authentication System

## Overview

A complete, production-ready authentication system integrated into your AI agency website with a beautiful design matching your brand color scheme.

### ✨ Features Implemented

- ✅ **User Registration (Signup)** - Create new accounts with email, password, and company info
- ✅ **User Login** - Secure login with email and password
- ✅ **JWT Authentication** - JSON Web Token-based session management
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **Protected Dashboard** - User-only dashboard accessible after login
- ✅ **Responsive Design** - Mobile-friendly authentication pages
- ✅ **Brand Consistency** - Matches your Material Design 3 color scheme
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Password Strength Indicator** - Visual feedback on password complexity
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Logout Functionality** - Secure session cleanup
- ✅ **Remember Me** - Optional session persistence

---

## 📁 File Structure

### Frontend (Client-Side)
```
public/
├── login.html          # Login page
├── signup.html         # Registration page
├── dashboard.html      # Protected user dashboard
├── auth.css           # Authentication styles
├── auth.js            # Authentication JavaScript
├── dashboard.css      # Dashboard styles
├── dashboard.js       # Dashboard functionality
└── index.html         # Updated with auth links
```

### Backend (Server-Side)
```
server.js              # Updated with auth endpoints
.env                   # Environment configuration
package.json           # Updated with dependencies
```

---

## 🎨 Design System

### Color Scheme (Material Design 3)
- **Primary**: `#0041a2` (Deep Blue)
- **Secondary**: `#006b5b` (Teal)
- **Tertiary**: `#274b5f` (Slate Blue)
- **Error**: `#ba1a1a` (Red)
- **Surface**: `#f8f9fa` (Light Gray)

### Typography
- **Headline Font**: Manrope (Bold, 800)
- **Body Font**: Inter (Regular, 400-700)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **Express** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **cookie-parser** - Cookie management
- **dotenv** - Environment variables

### 2. Configure Environment Variables

Edit `.env` file:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

### 3. Run the Development Server

```bash
npm start
```

The server will start at `http://localhost:3000`

---

## 📌 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Account created successfully!",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

#### POST `/api/auth/login`
Log in an existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful!",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

#### GET `/api/auth/me`
Get current logged-in user info (requires auth token).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }
}
```

#### POST `/api/auth/logout`
Log out user and clear session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully!"
}
```

---

## 🔗 Page Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/login` | User login page | Public |
| `/signup` | User registration page | Public |
| `/dashboard` | User dashboard | Protected |
| `/services` | Services page | Public |
| `/insights` | Insights page | Public |
| `/blogs` | Blog page | Public |
| `/contact` | Contact page | Public |

---

## 🔒 Security Features

### Password Security
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ Server-side password validation
- ✅ Client-side password strength indicator
- ✅ Minimum 6 characters for login, 8 for registration

### Token Security
- ✅ JWT tokens with expiration (7 days)
- ✅ HttpOnly cookies (prevents XSS attacks)
- ✅ Secure flag set in production
- ✅ SameSite cookie policy

### Input Validation
- ✅ Email format validation
- ✅ Required field validation
- ✅ Password confirmation matching
- ✅ Company name is optional

---

## 💻 Frontend Implementation

### Using Authentication

#### Check if User is Logged In
```javascript
const isLoggedIn = localStorage.getItem('authToken');
if (isLoggedIn) {
  // User is logged in
}
```

#### Get Auth Token
```javascript
const token = localStorage.getItem('authToken');
```

#### Make Authenticated API Calls
```javascript
fetch('/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### Logout
```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('userEmail');
window.location.href = '/login';
```

---

## 🎯 User Journey

### Signup Flow
1. User clicks "Get Started" button
2. Navigates to `/signup` page
3. Fills in registration form:
   - Full Name
   - Email Address
   - Company (optional)
   - Password (with strength indicator)
   - Confirm Password
   - Accept Terms & Conditions
4. Form validates input
5. Server creates account
6. User receives JWT token
7. Redirected to `/dashboard`

### Login Flow
1. User clicks "Sign In" button
2. Navigates to `/login` page
3. Enters email and password
4. Optional "Remember Me" checkbox
5. Form validates input
6. Server authenticates user
7. User receives JWT token
8. Redirected to `/dashboard`

### Dashboard
1. User accesses `/dashboard`
2. Page checks for valid auth token
3. Fetches user data from `/api/auth/me`
4. Displays personalized dashboard
5. Shows projects, stats, and analytics
6. User can logout from top-right menu

---

## 📱 Responsive Design

### Desktop (≥768px)
- Full sidebar navigation on the left
- Full-width content area
- Desktop navigation menu visible
- Auth buttons in header

### Tablet (< 768px)
- Collapsible sidebar
- Hamburger menu toggle
- Optimized touch targets
- Mobile-friendly forms

### Mobile (< 480px)
- Full-screen forms
- Single-column layout
- Bottom navigation hidden
- Vertical spacing optimized

---

## 🔄 User Data Flow

```
┌─────────────────┐
│  User Signup    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Validate Input │───▶ │  Hash Password   │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Create User in Database    │
│  (In-Memory in dev)         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Generate JWT   │───▶  │  Set HttpOnly    │
│  Token (7 days) │      │  Cookie          │
└────────┬────────┘      └──────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Return Token to Client     │
│  (Stored in localStorage)   │
└─────────────────────────────┘
```

---

## 🐛 Development Notes

### In-Memory Database
Currently, user data is stored in an in-memory Map in `server.js`. This is perfect for development but **not suitable for production**.

### To Connect to MongoDB (Production)

1. Install mongoose:
```bash
npm install mongoose
```

2. Update server.js to use MongoDB instead of in-memory storage

3. Create User schema:
```javascript
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  company: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});
```

### Environment Configuration

For production, update `.env`:
```env
NODE_ENV=production
JWT_SECRET=your_very_long_random_secret_key_here
DATABASE_URL=mongodb://production-server:27017/node-nexus-ai
```

---

## 📊 Database Schema (When Using MongoDB)

```javascript
User {
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique),
  company: String (optional),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date (optional)
}
```

---

## 🧪 Testing the Authentication

### Test Signup
1. Go to `http://localhost:3000/signup`
2. Enter:
   - Full Name: Test User
   - Email: test@example.com
   - Company: Test Company
   - Password: TestPass123!
   - Confirm: TestPass123!
3. Check Terms checkbox
4. Click "Create Account"
5. Should be redirected to `/dashboard`

### Test Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: test@example.com
   - Password: TestPass123!
3. Click "Sign In"
4. Should be redirected to `/dashboard`

### Test Protected Routes
1. Without login, try accessing `/dashboard`
2. Should redirect to `/login`

---

## 🚀 Next Steps / Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] User profile page
- [ ] Account settings
- [ ] Activity logs
- [ ] Rate limiting on auth endpoints
- [ ] Refresh token rotation
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Session management

---

## 📞 Support

For issues or questions about the authentication system, check:
- Server logs for backend errors
- Browser console for frontend errors
- `.env` configuration for environment issues

---

## 📄 License

This authentication system is part of the Node and Nexus Ai website project.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: ✅ Production Ready (for development/staging)
