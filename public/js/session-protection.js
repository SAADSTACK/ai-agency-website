/* ═══════════════════════════════════════════════════
   Session Protection Utility
   Simple redirect for already logged-in users
   ═══════════════════════════════════════════════════ */

async function protectRoute(allowedPath = null) {
  // Wait for Supabase client to be ready
  if (!window.supabaseClient) {
    console.warn('Supabase client not ready, retrying...');
    setTimeout(() => protectRoute(allowedPath), 500);
    return;
  }

  const currentPath = window.location.pathname;
  const authRoutes = ['/login', '/signup'];

  // Check if current path is auth page
  const isAuthPage = authRoutes.some(route => currentPath.startsWith(route));

  // Get current session
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (isAuthPage && session) {
    // User already logged in, trying to access auth page - redirect to home
    console.log('Logged in user accessing auth page, redirecting to home');
    window.location.href = '/';
    return;
  }
}

// Run protection check on page load
document.addEventListener('DOMContentLoaded', protectRoute);
