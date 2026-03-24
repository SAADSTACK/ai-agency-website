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

// ── Mobile menu ──
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (!toggle || !mobileNav) return;
  
  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const icon = toggle.querySelector('.material-symbols-outlined');
    icon.textContent = mobileNav.classList.contains('open') ? 'close' : 'menu';
  });
}

// ── Initialize everything ──
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollAnimations();
  initActiveNav();
  animateCounters();
  initProgressBars();
  initMobileMenu();
  initContactForm();
});
