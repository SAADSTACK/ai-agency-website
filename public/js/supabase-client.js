/* ═══════════════════════════════════════════════════
   Supabase Client Initialization
   ═══════════════════════════════════════════════════ */

// Supabase credentials - stored as window variables for client-side access
const SUPABASE_URL = 'https://liysbnmahizaqlhjsxyr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Lq9UbcVG3AB6N0rQbkA3tg_1S9U_qv3';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabaseClient;

// ── Monitor auth state changes ──
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // User logged in or token refreshed
    localStorage.setItem('supabase_session', JSON.stringify(session));
    updateAuthUI(session);
  } else if (event === 'SIGNED_OUT') {
    // User logged out
    localStorage.removeItem('supabase_session');
    updateAuthUI(null);
  }
});

// ── Update UI based on auth status ──
function updateAuthUI(session) {
  const loginBtn = document.getElementById('loginBtnHeader');
  const signupBtn = document.getElementById('signupBtnHeader');
  const logoutBtn = document.getElementById('logoutBtnHeader');
  const headerAvatar = document.getElementById('headerAvatar');
  const headerActions = document.getElementById('headerActions');
  
  if (session) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) {
      logoutBtn.style.display = 'flex';
      logoutBtn.onclick = handleLogout;
    }
    if (headerAvatar) {
      headerAvatar.style.display = 'flex';
      const userEmail = session.user?.email || 'User';
      headerAvatar.title = userEmail;
    }
  } else {
    // User is logged out
    if (loginBtn) loginBtn.style.display = 'flex';
    if (signupBtn) signupBtn.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (headerAvatar) headerAvatar.style.display = 'none';
  }
}

// ── Logout handler ──
async function handleLogout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
    showToast('Logout failed', 'error');
  } else {
    console.log('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  }
}

// ── Get current session ──
async function getCurrentSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session;
}

// ── Check if user is authenticated ──
async function isUserAuthenticated() {
  const session = await getCurrentSession();
  return !!session;
}

// ── Toast notification utility ──
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Initialize on page load ──
document.addEventListener('DOMContentLoaded', async () => {
  const session = await getCurrentSession();
  updateAuthUI(session);
});
