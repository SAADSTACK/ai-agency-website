/* ═══════════════════════════════════════════════════
   Dashboard JavaScript
   User dashboard functionality and interactions
   ═══════════════════════════════════════════════════ */

// ── Check Authentication on Page Load ──
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  setupEventListeners();
});

// ── Load User Data ──
async function loadUserData() {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      redirectToLogin();
      return;
    }

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirectToLogin();
      }
      return;
    }

    const data = await response.json();
    
    if (data.success && data.user) {
      displayUserData(data.user);
    } else {
      redirectToLogin();
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    redirectToLogin();
  }
}

// ── Display User Data ──
function displayUserData(user) {
  // Update welcome message
  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName) {
    welcomeName.textContent = user.fullName.split(' ')[0];
  }

  // Update user menu
  const userFullName = document.getElementById('userFullName');
  const userEmail = document.getElementById('userEmail');
  
  if (userFullName) {
    userFullName.textContent = user.fullName;
  }
  if (userEmail) {
    userEmail.textContent = user.email;
  }

  console.log('✓ User data loaded:', user.email);
}

// ── Setup Event Listeners ──
function setupEventListeners() {
  // User menu toggle
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.style.display = 'none';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Mobile menu toggle
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !sidebar.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Setup navigation
  setupNavigation();
}

// ── Setup Navigation ── 
function setupNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Remove active class from all items
      navItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Close mobile sidebar
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.remove('active');
      }
    });
  });
}

// ── Handle Logout ──
async function handleLogout(e) {
  e.preventDefault();

  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });

    if (response.ok) {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      
      // Redirect to login
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails on server, clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  }
}

// ── Redirect to Login ──
function redirectToLogin() {
  window.location.href = '/login';
}

// ── Utility: Check if user is still authenticated ──
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

// ── Utility: Get auth headers ──
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// ── Handle project card interactions (Future API integration) ──
document.addEventListener('DOMContentLoaded', () => {
  const menuDots = document.querySelectorAll('.menu-dots');
  
  menuDots.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO: Implement project menu options
      console.log('Project menu clicked');
    });
  });
});
