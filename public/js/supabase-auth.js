/* ═══════════════════════════════════════════════════
   Supabase Authentication Handler
   Updated auth logic for Supabase
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
    loginForm.addEventListener('submit', handleSupabaseLogin);
  }

  // Handle signup form submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSupabaseSignup);
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('input', updatePasswordStrength);
    }
  }
});

// ── Handle Supabase Login ──
async function handleSupabaseLogin(e) {
  e.preventDefault();
  clearMessages();
  
  if (!window.supabaseClient) {
    showFormError('Supabase client not initialized');
    return;
  }
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
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
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showFormError(error.message || 'Login failed. Please try again.');
      return;
    }

    // Success - session is automatically managed by Supabase
    localStorage.setItem('supabase_session', JSON.stringify(data.session));
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

// ── Handle Supabase Signup ──
async function handleSupabaseSignup(e) {
  e.preventDefault();
  clearMessages();
  
  if (!window.supabaseClient) {
    showFormError('Supabase client not initialized');
    return;
  }
  
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
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
    const { data, error } = await window.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      showFormError(error.message || 'Signup failed. Please try again.');
      return;
    }

    // Success - show confirmation message
    if (data.user && !data.session) {
      // Email confirmation required
      showFormSuccess('Account created! Check your email to confirm your address.');
      setTimeout(() => {
        // Show check email message
        document.getElementById('signupForm').style.display = 'none';
        const checkEmailDiv = document.createElement('div');
        checkEmailDiv.innerHTML = `
          <div style="text-align:center;padding:2rem;">
            <span class="material-symbols-outlined" style="font-size:4rem;color:var(--primary);margin-bottom:1rem;display:block;">mail_outline</span>
            <h2 style="color:var(--on-surface);margin-bottom:0.5rem;">Check Your Email</h2>
            <p style="color:var(--on-surface-variant);margin-bottom:2rem;">We've sent a confirmation link to ${email}</p>
            <p style="color:var(--on-surface-variant);font-size:0.9rem;">Click the link to complete your signup and start using Node & Nexus Ai.</p>
          </div>
        `;
        document.querySelector('.auth-form-section').appendChild(checkEmailDiv);
      }, 1500);
    } else if (data.session) {
      // Auto-confirmed (rare case)
      localStorage.setItem('supabase_session', JSON.stringify(data.session));
      showFormSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    }

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
  if (!button) return;
  
  const buttonText = button.querySelector('.btn-text');
  const loader = button.querySelector('.btn-loader');
  
  if (isLoading) {
    button.disabled = true;
    if (buttonText) buttonText.style.display = 'none';
    if (loader) loader.style.display = 'inline-block';
  } else {
    button.disabled = false;
    if (buttonText) {
      buttonText.style.display = 'inline';
      buttonText.textContent = text;
    }
    if (loader) loader.style.display = 'none';
  }
}

// ── Redirect logged-in users away from auth pages ──
async function redirectIfLoggedIn() {
  if (!window.supabaseClient) {
    setTimeout(redirectIfLoggedIn, 500);
    return;
  }
  
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  const currentPage = window.location.pathname;
  
  if (session && (currentPage === '/login' || currentPage === '/signup')) {
    window.location.href = '/dashboard';
  }
}

// Auto-redirect on page load
redirectIfLoggedIn();
