/* ---------------------------------------------------
   Simple Supabase Authentication
   Basic Email + Password Sign In / Sign Up
   --------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  setupAuthHandlers();
  redirectIfLoggedIn();
});

// -- Setup form handlers --
function setupAuthHandlers() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Password visibility toggle
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
}

// -- Handle Login --
async function handleLogin(e) {
  e.preventDefault();
  
  if (!window.supabaseClient) {
    alert('System not ready. Please refresh the page.');
    return;
  }

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Basic validation
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  if (!email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }

  try {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    // Store session and redirect
    localStorage.setItem('supabase_session', JSON.stringify(data.session));
    window.location.href = '/';

  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
}

// -- Handle Signup --
async function handleSignup(e) {
  e.preventDefault();
  
  if (!window.supabaseClient) {
    alert('System not ready. Please refresh the page.');
    return;
  }

  const fullName = document.getElementById('fullName')?.value.trim() || '';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword')?.value || '';

  // Basic validation
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  if (!email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

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
      alert('Signup failed: ' + error.message);
      return;
    }

    // If session available immediately, login success
    if (data.session) {
      localStorage.setItem('supabase_session', JSON.stringify(data.session));
      alert('Account created! Redirecting home...');
      window.location.href = '/';
    } else if (data.user) {
      // User created but needs email verification
      alert('Account created! Please check your email to verify your address.');
    }

  } catch (error) {
    console.error('Signup error:', error);
    alert('An error occurred during signup.');
  }
}

// -- Redirect if already logged in --
async function redirectIfLoggedIn() {
  if (!window.supabaseClient) {
    setTimeout(redirectIfLoggedIn, 500);
    return;
  }

  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    const currentPage = window.location.pathname;

    if (session && (currentPage === '/login' || currentPage === '/signup')) {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
}
