/* ═══════════════════════════════════════════════════
   Node and Nexus Ai - Shared JavaScript
   ═══════════════════════════════════════════════════ */

// ── Header scroll behavior ──
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// ── Scroll animations ──
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ── Toast notifications ──
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Contact form handler ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('https://formspree.io/f/xvzwlzwj', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        showToast('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
      } else {
        let errorMsg = 'Something went wrong.';
        try {
          const result = await res.json();
          if (result.errors) {
            errorMsg = result.errors.map(e => e.message).join(', ');
          }
        } catch(e) {}
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ── Smooth nav highlighting ──
function initActiveNav() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-item');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '/' && href === '/') || 
        (path.startsWith(href) && href !== '/')) {
      link.classList.add('active');
    }
  });
}

// ── Animated counter ──
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const target = counter.getAttribute('data-counter');
    const isPercent = target.includes('%');
    const isPlus = target.includes('+');
    const numValue = parseFloat(target.replace(/[^0-9.]/g, ''));
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * numValue);
      
      let display = current.toString();
      if (isPercent) display += '%';
      if (isPlus) display += '+';
      
      counter.textContent = display;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }
    
    // Start when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(update);
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// ── Progress bar animation ──
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  
  bars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          bar.style.width = width;
        }, 300);
        observer.unobserve(bar);
      }
    }, { threshold: 0.5 });
    
    observer.observe(bar);
  });
}

// ── Auth CTA links should navigate on first click/tap ──
function initAuthCTALinks() {
  const authLinks = document.querySelectorAll('#loginBtnHeader, #signupBtnHeader, #loginBtnMobile, #signupBtnMobile');
  if (!authLinks.length) return;

  const navigate = (link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    window.location.assign(href);
  };

  authLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link);
    });

    // Touch fallback for mobile browsers that may consume the first tap as hover/focus.
    link.addEventListener('touchend', (e) => {
      e.preventDefault();
      navigate(link);
    }, { passive: false });
  });
}

// ── Mobile menu ──
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('closeMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle || !mobileNav) return;
  
  // Open mobile menu
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close mobile menu
  const closeMobileMenu = () => {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  closeBtn.addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking on a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  // Update mobile menu for logged in users
  updateMobileMenuAuthStatus();
}

// ── Update mobile menu auth status ──
function updateMobileMenuAuthStatus() {
  const token = localStorage.getItem('authToken');
  const mobileAuthSection = document.getElementById('mobileAuthSection');
  const mobileUserSection = document.getElementById('mobileUserSection');
  const mobileUserName = document.getElementById('mobileUserName');
  const mobileUserEmail = document.getElementById('mobileUserEmail');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  
  // Make sure elements exist
  if (!mobileAuthSection || !mobileUserSection) return;
  
  if (token) {
    // User is logged in - show user section, hide auth buttons
    mobileAuthSection.style.display = 'none !important';
    mobileUserSection.style.display = 'flex !important';
    mobileUserSection.style.flexDirection = 'column';
    
    // Try to fetch user info
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.user) {
        mobileUserName.textContent = data.user.fullName;
        mobileUserEmail.textContent = data.user.email;
      }
    })
    .catch(err => console.error('Error fetching user:', err));
    
    // Logout handler for mobile
    if (mobileLogoutBtn) {
      mobileLogoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      };
    }
  } else {
    // User is not logged in - show auth buttons, hide user section
    mobileAuthSection.style.display = 'flex !important';
    mobileAuthSection.style.flexDirection = 'column';
    mobileUserSection.style.display = 'none !important';
  }
}

// Listen for auth changes
window.addEventListener('storage', updateMobileMenuAuthStatus);

// ── Initialize everything ──
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollAnimations();
  initActiveNav();
  animateCounters();
  initProgressBars();
  initAuthCTALinks();
  initMobileMenu();
  initContactForm();
  
  // Update mobile menu auth status on load
  setTimeout(() => {
    updateMobileMenuAuthStatus();
  }, 100);
});
