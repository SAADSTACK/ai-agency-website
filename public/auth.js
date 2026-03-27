/* ═══════════════════════════════════════════════════
   Authentication JavaScript
   Client-side auth logic for login/signup
   ═══════════════════════════════════════════════════ */

// ── Password Visibility Toggle ──
document.addEventListener('DOMContentLoaded', () => {
  // Toggle password visibility on login page
  const togglePassword = document.getElementById('togglePassword');
  if (togglePassword) {
    togglePassword.addEventListener('click', (e) => {
      e.preventDefault();
      const passwordInput = document.getElementById('password');
      const icon = togglePassword.querySelector('.material-symbols-outlined');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        passwordInput.type = 'password';
        icon.textContent = 'visibility';
      }
    });
  }

  // Toggle confirm password visibility on signup page
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmPasswordInput = document.getElementById('confirmPassword');
      const icon = toggleConfirmPassword.querySelector('.material-symbols-outlined');
      
      if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        confirmPasswordInput.type = 'password';
        icon.textContent = 'visibility';
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Handle signup form submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('input', updatePasswordStrength);
    }
  }
});

// ── Handle Login ──
async function handleLogin(e) {
  e.preventDefault();
  clearMessages();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Validation
  if (!validateEmail(email)) {
    showErrorMessage('emailError', 'Please enter a valid email address');
    return;
  }
  
  if (password.length < 6) {
    showErrorMessage('passwordError', 'Password must be at least 6 characters');
    return;
  }
  
  // Show loading state
  setButtonLoading(true, 'loginBtn', 'Signing in...');
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        rememberMe
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showFormError(data.message || data.error || 'Login failed. Please try again.');
      return;
    }

    // Success - store token and redirect
    localStorage.setItem('authToken', data.token);
    if (rememberMe) {
      localStorage.setItem('userEmail', email);
    }
    
    showFormSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);

  } catch (error) {
    console.error('Login error:', error);
    showFormError('An error occurred. Please try again.');
  } finally {
    setButtonLoading(false, 'loginBtn', 'Sign In');
  }
}

// ── Handle Signup ──
async function handleSignup(e) {
  e.preventDefault();
  clearMessages();
  
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;
  
  // Validation
  if (!fullName || fullName.length < 3) {
    showErrorMessage('fullNameError', 'Full name must be at least 3 characters');
    return;
  }
  
  if (!validateEmail(email)) {
    showErrorMessage('emailError', 'Please enter a valid email address');
    return;
  }
  
  if (password.length < 8) {
    showErrorMessage('passwordError', 'Password must be at least 8 characters');
    return;
  }
  
  if (password !== confirmPassword) {
    showErrorMessage('confirmPasswordError', 'Passwords do not match');
    return;
  }
  
  if (!terms) {
    showFormError('You must agree to the Terms of Service and Privacy Policy');
    return;
  }
  
  // Show loading state
  setButtonLoading(true, 'signupBtn', 'Creating account...');
  
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        company,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showFormError(data.message || data.error || 'Signup failed. Please try again.');
      return;
    }

    // Success - store token and redirect
    localStorage.setItem('authToken', data.token);
    
    showFormSuccess('Account created successfully! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);

  } catch (error) {
    console.error('Signup error:', error);
    showFormError('An error occurred. Please try again.');
  } finally {
    setButtonLoading(false, 'signupBtn', 'Create Account');
  }
}

// ── Password Strength Indicator ──
function updatePasswordStrength() {
  const password = document.getElementById('password').value;
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  let strength = 'Weak';
  let strengthClass = 'weak';
  
  if (password.length >= 8) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    const scoreMap = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (scoreMap === 1) {
      strength = 'Fair';
      strengthClass = 'fair';
    } else if (scoreMap === 2 || scoreMap === 3) {
      strength = 'Good';
      strengthClass = 'good';
    } else if (scoreMap === 4) {
      strength = 'Strong';
      strengthClass = 'strong';
    }
  }
  
  // Update UI
  strengthFill.className = 'strength-fill ' + strengthClass;
  strengthText.textContent = 'Password strength: ' + strength;
}

// ── Utility Functions ──

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Clear after 5 seconds
    setTimeout(() => {
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }, 5000);
  }
}

function showFormError(message) {
  const formError = document.getElementById('formError');
  if (formError) {
    formError.textContent = message;
    formError.classList.add('show');
  }
}

function showFormSuccess(message) {
  const formSuccess = document.getElementById('formSuccess');
  if (formSuccess) {
    formSuccess.textContent = message;
    formSuccess.classList.add('show');
  }
}

function clearMessages() {
  // Clear all error messages
  const errorElements = document.querySelectorAll('.form-error');
  errorElements.forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
  
  // Clear form alerts
  const alertElements = document.querySelectorAll('.form-alert');
  alertElements.forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
}

function setButtonLoading(isLoading, buttonId, text) {
  const button = document.getElementById(buttonId);
  const buttonText = button.querySelector('.btn-text');
  const loader = button.querySelector('.btn-loader');
  
  if (isLoading) {
    button.disabled = true;
    buttonText.style.display = 'none';
    loader.style.display = 'inline-block';
  } else {
    button.disabled = false;
    buttonText.style.display = 'inline';
    loader.style.display = 'none';
    buttonText.textContent = text;
  }
}

// ── Check if user is logged in ──
function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

// ── Get auth token ──
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// ── Logout ──
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  window.location.href = '/login';
}

// ── Redirect logged-in users away from auth pages ──
async function redirectIfLoggedIn() {
  const token = getAuthToken();
  const currentPage = window.location.pathname;
  const isAuthPage = currentPage === '/login' || currentPage === '/signup';

  if (!token || !isAuthPage) return;

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // Token is stale/invalid, clear and allow user to access auth pages.
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      return;
    }

    const data = await response.json();
    if (data.success) {
      window.location.href = '/dashboard';
    }
  } catch (error) {
    // Keep user on auth page if validation fails due to network issues.
    console.error('Auth validation failed:', error);
  }
}

// Auto-redirect on page load
redirectIfLoggedIn();
