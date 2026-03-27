/* ═══════════════════════════════════════════════════
   Session Protection Utility
   Checks user authentication and redirects if needed
   ═══════════════════════════════════════════════════ */

async function protectRoute(allowedPath = null) {
  // Wait for Supabase client to be ready
  if (!window.supabaseClient) {
    console.warn('Supabase client not ready, retrying...');
    setTimeout(() => protectRoute(allowedPath), 500);
    return;
  }

  const currentPath = window.location.pathname;
  const protectedRoutes = ['/dashboard', '/insights'];
  const authRoutes = ['/login', '/signup'];

  // Check if current path is protected
  const isProtected = protectedRoutes.some(route => currentPath.startsWith(route));
  const isAuthPage = authRoutes.some(route => currentPath.startsWith(route));

  // Get current session
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (isProtected && !session) {
    // User trying to access protected route without logging in
    console.log('Protected route accessed without auth, redirecting to login');
    window.location.href = '/login';
    return;
  }

  if (isAuthPage && session) {
    // User already logged in, trying to access auth page
    console.log('Logged in user accessing auth page, redirecting to dashboard');
    window.location.href = '/dashboard';
    return;
  }
}

// Run protection check on page load
document.addEventListener('DOMContentLoaded', protectRoute);
