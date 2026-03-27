/* ═══════════════════════════════════════════════════
   OTP Verification Handler
   Handles 2FA/MFA verification during login
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  setupOTPInputs();
  setupFormHandlers();
  checkAuthState();
});

// ── Setup OTP input navigation ──
function setupOTPInputs() {
  const otpInputs = document.querySelectorAll('.otp-digit');

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      // Only allow digits
      if (!/^\d*$/.test(input.value)) {
        input.value = '';
        return;
      }

      // Move to next input if filled
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }

      // Auto-submit if all fields filled
      if (getAllOTPValues().length === 6) {
        clearOTPError();
      }
    });

    input.addEventListener('keydown', (e) => {
      // Handle backspace to move to previous input
      if (e.key === 'Backspace' && index > 0 && input.value === '') {
        otpInputs[index - 1].focus();
      }

      // Allow copy/paste
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        navigator.clipboard.readText().then((text) => {
          const digits = text.replace(/\D/g, '').slice(0, 6);
          if (digits.length > 0) {
            otpInputs.forEach((input, idx) => {
              input.value = digits[idx] || '';
            });
            otpInputs[Math.min(digits.length, otpInputs.length - 1)].focus();
          }
        });
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
    });
  });
}

// ── Setup form handlers ──
function setupFormHandlers() {
  const otpForm = document.getElementById('otpForm');
  const backBtn = document.getElementById('backBtn');
  const verifyBtn = document.getElementById('verifyBtn');
  const resendBtn = document.getElementById('resendBtn');

  if (otpForm) {
    otpForm.addEventListener('submit', handleOTPSubmit);
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      sessionStorage.removeItem('mfa_required');
      sessionStorage.removeItem('pending_auth_session');
      window.location.href = '/login';
    });
  }

  if (resendBtn) {
    resendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Please check your email for backup codes', 'info');
    });
  }
}

// ── Get all OTP values ──
function getAllOTPValues() {
  const otpInputs = document.querySelectorAll('.otp-digit');
  return Array.from(otpInputs)
    .map((input) => input.value)
    .join('');
}

// ── Handle OTP submission ──
async function handleOTPSubmit(e) {
  e.preventDefault();

  if (!window.supabaseClient) {
    showOTPError('Supabase client not initialized');
    return;
  }

  const otp = getAllOTPValues();

  // Validate OTP length
  if (otp.length !== 6) {
    showOTPError('Please enter all 6 digits');
    return;
  }

  // Validate OTP is numeric
  if (!/^\d{6}$/.test(otp)) {
    showOTPError('Code must contain only numbers');
    return;
  }

  setButtonLoading(true, 'verifyBtn', 'Verifying...');

  try {
    // Get the pending auth session
    const pendingSession = sessionStorage.getItem('pending_auth_session');
    if (!pendingSession) {
      showOTPError('Session expired. Please login again.');
      setButtonLoading(false, 'verifyBtn', 'Verify Code');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    const { session: pendingAuthSession } = JSON.parse(pendingSession);

    // Get available MFA factors
    const { data: factors, error: factorsError } = await window.supabaseClient.auth.mfa.listFactors();

    if (factorsError || !factors || !factors.totp || factors.totp.length === 0) {
      showOTPError('No MFA found for this account');
      return;
    }

    const totpFactor = factors.totp[0];

    // Create MFA challenge
    const { data: challengeData, error: challengeError } = await window.supabaseClient.auth.mfa.challenge({
      factorId: totpFactor.id
    });

    if (challengeError) {
      console.error('Challenge error:', challengeError);
      showOTPError('Failed to create challenge. Please try again.');
      return;
    }

    // Verify the OTP code
    const { data: verifyData, error: verifyError } = await window.supabaseClient.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challengeData.id,
      code: otp
    });

    if (verifyError) {
      console.error('Verification error:', verifyError);
      showOTPError('Invalid code. Please try again.');
      clearOTPInputs();
      return;
    }

    // Success - MFA verified
    localStorage.setItem('supabase_session', JSON.stringify(verifyData.session));
    sessionStorage.removeItem('mfa_required');
    sessionStorage.removeItem('pending_auth_session');

    showToast('Two-Factor Authentication verified! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);

  } catch (error) {
    console.error('OTP verification error:', error);
    showOTPError('An error occurred. Please try again.');
  } finally {
    setButtonLoading(false, 'verifyBtn', 'Verify Code');
  }
}

// ── Check if user should be on this page ──
async function checkAuthState() {
  if (!window.supabaseClient) {
    setTimeout(checkAuthState, 500);
    return;
  }

  const mfaRequired = sessionStorage.getItem('mfa_required');
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  // If no MFA required or already authenticated, redirect
  if (!mfaRequired) {
    if (session) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }
}

// ── Utility functions ──

function showOTPError(message) {
  const errorEl = document.getElementById('otpError');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');

    setTimeout(() => {
      errorEl.classList.remove('show');
    }, 5000);
  }
}

function clearOTPError() {
  const errorEl = document.getElementById('otpError');
  if (errorEl) {
    errorEl.classList.remove('show');
    errorEl.textContent = '';
  }
}

function clearOTPInputs() {
  document.querySelectorAll('.otp-digit').forEach((input) => {
    input.value = '';
  });
  document.getElementById('otp1')?.focus();
}

function setButtonLoading(isLoading, btnId, text) {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.disabled = isLoading;
    btn.textContent = isLoading ? text : 'Verify Code';
    btn.style.opacity = isLoading ? '0.7' : '1';
  }
}

// Toast notification
function showToast(message, type = 'success') {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'center',
      backgroundColor:
        type === 'success'
          ? '#10b981'
          : type === 'error'
          ? '#ef4444'
          : '#3b82f6',
      stopOnFocus: true
    }).showToast();
  } else {
    console.log(`[${type}] ${message}`);
  }
}
