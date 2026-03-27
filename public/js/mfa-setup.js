/* ═══════════════════════════════════════════════════
   MFA/2FA Setup Handler
   Manages two-factor authentication enrollment
   ═══════════════════════════════════════════════════ */

let mfaEnrollmentData = null;

document.addEventListener('DOMContentLoaded', () => {
  checkMFAStatus();
  setupMFAButton();
});

// ── Check MFA status ──
async function checkMFAStatus() {
  if (!window.supabaseClient) {
    setTimeout(checkMFAStatus, 500);
    return;
  }

  try {
    const { data: factors, error } = await window.supabaseClient.auth.mfa.listFactors();

    if (error) {
      console.error('Error checking MFA status:', error);
      return;
    }

    if (factors && factors.totp && factors.totp.length > 0) {
      // MFA is enabled
      updateMFAStatus(true, factors.totp[0].id);
    } else {
      // MFA is not enabled
      updateMFAStatus(false);
    }
  } catch (error) {
    console.error('MFA status check failed:', error);
  }
}

// ── Update MFA status display ──
function updateMFAStatus(isEnabled, factorId) {
  const mfaStatusText = document.getElementById('mfaStatusText');
  const mfaStatusIcon = document.getElementById('mfaStatusIcon');
  const toggleMfaBtn = document.getElementById('toggleMfaBtn');

  if (isEnabled) {
    // MFA is enabled
    if (mfaStatusText) {
      mfaStatusText.textContent = 'Enabled';
      mfaStatusText.style.color = '#10b981';
    }
    if (mfaStatusIcon) {
      mfaStatusIcon.textContent = 'check_circle';
      mfaStatusIcon.style.color = '#10b981';
    }
    if (toggleMfaBtn) {
      toggleMfaBtn.textContent = 'Disable 2FA';
      toggleMfaBtn.onclick = () => disableMFA(factorId);
      // Change button color to warning/danger
      toggleMfaBtn.style.background = '#ef4444';
    }
  } else {
    // MFA is not enabled
    if (mfaStatusText) {
      mfaStatusText.textContent = 'Not Enabled';
      mfaStatusText.style.color = '#ef4444';
    }
    if (mfaStatusIcon) {
      mfaStatusIcon.textContent = 'close';
      mfaStatusIcon.style.color = '#ef4444';
    }
  }
}

// ── Setup MFA button handler ──
function setupMFAButton() {
  const toggleMfaBtn = document.getElementById('toggleMfaBtn');
  if (toggleMfaBtn) {
    toggleMfaBtn.addEventListener('click', () => {
      // Check current status from textContent
      if (toggleMfaBtn.textContent.includes('Disable')) {
        // Will be replaced by onclick from updateMFAStatus
        return;
      }
      startMFAEnrollment();
    });
  }
}

// ── Start MFA enrollment ──
async function startMFAEnrollment() {
  if (!window.supabaseClient) {
    showToast('Supabase client not initialized', 'error');
    return;
  }

  try {
    showToast('Setting up Two-Factor Authentication...', 'info');

    // Enroll new TOTP factor
    const { data, error } = await window.supabaseClient.auth.mfa.enroll({
      factorType: 'totp'
    });

    if (error) {
      console.error('Enrollment error:', error);
      showToast('Failed to initialize 2FA setup: ' + error.message, 'error');
      return;
    }

    // Store enrollment data
    mfaEnrollmentData = data;

    // Show MFA setup modal
    showMFASetupModal(data);
  } catch (error) {
    console.error('MFA enrollment error:', error);
    showToast('An error occurred during 2FA setup', 'error');
  }
}

// ── Show MFA setup modal ──
function showMFASetupModal(enrollmentData) {
  // Create modal structure
  const modalHTML = `
    <div class="mfa-modal-overlay" id="mfaModalOverlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
      <div class="mfa-modal" style="background:var(--surface);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.16);max-width:500px;width:90%;max-height:90vh;overflow-y:auto;padding:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2 style="font-size:1.5rem;font-weight:700;color:var(--on-surface);margin:0;">Set Up Two-Factor Auth</h2>
          <button style="background:none;border:none;cursor:pointer;color:var(--on-surface-variant);font-size:1.5rem;" onclick="closeMFASetupModal()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style="background:var(--surface-variant);border-left:4px solid var(--primary);padding:1rem;border-radius:8px;margin-bottom:1.5rem;">
          <p style="color:var(--on-surface-variant);font-size:0.9rem;margin:0;">
            <strong>Step 1:</strong> Scan the QR code with an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy.
          </p>
        </div>

        <!-- QR Code Display -->
        <div style="background:white;padding:1.5rem;border-radius:12px;border:1px solid var(--outline);margin-bottom:1.5rem;display:flex;justify-content:center;align-items:center;min-height:280px;">
          <canvas id="qrCanvas" width="256" height="256" style="max-width:100%;"></canvas>
        </div>

        <!-- Manual Entry Option -->
        <details style="margin-bottom:1.5rem;">
          <summary style="cursor:pointer;color:var(--primary);font-weight:600;user-select:none;">Can't scan? Enter manually</summary>
          <div style="margin-top:1rem;background:var(--surface-variant);padding:1rem;border-radius:8px;">
            <p style="color:var(--on-surface-variant);font-size:0.9rem;margin:0 0 0.75rem 0;">
              <strong>Secret Key:</strong>
            </p>
            <p style="font-family:monospace;background:var(--surface);padding:0.75rem;border-radius:4px;word-break:break-all;color:var(--on-surface);font-size:0.85rem;margin:0;border:1px solid var(--outline);">
              ${enrollmentData.totp.secret || 'Unable to display secret'}
            </p>
          </div>
        </details>

        <!-- OTP Verification -->
        <div style="margin-bottom:1.5rem;">
          <label for="mfaVerificationCode" style="display:block;font-weight:600;color:var(--on-surface);margin-bottom:0.75rem;">
            <strong>Step 2:</strong> Enter the 6-digit code from your app
          </label>
          <input 
            type="text" 
            id="mfaVerificationCode" 
            maxlength="6" 
            placeholder="000000"
            inputmode="numeric"
            style="width:100%;padding:0.75rem;border:2px solid var(--outline);border-radius:8px;font-size:1.25rem;text-align:center;letter-spacing:0.25rem;background:var(--surface);color:var(--on-surface);"
          />
          <p style="color:var(--error);font-size:0.85rem;margin:0.5rem 0 0 0;display:none;" id="mfaCodeError"></p>
        </div>

        <!-- Buttons -->
        <div style="display:flex;gap:1rem;">
          <button onclick="closeMFASetupModal()" style="flex:1;padding:0.75rem;border:2px solid var(--outline);background:none;color:var(--on-surface);border-radius:8px;font-weight:600;cursor:pointer;">
            Cancel
          </button>
          <button id="verifyMfaBtn" style="flex:1;padding:0.75rem;background:var(--primary);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s ease;" onclick="verifyMFASetup()">
            Verify & Enable
          </button>
        </div>

        <p style="color:var(--on-surface-variant);font-size:0.8rem;margin:1.5rem 0 0 0;text-align:center;line-height:1.5;">
          🔒 Your authenticator app will generate a new code every 30 seconds. You'll need to enter this code whenever you sign in.
        </p>
      </div>
    </div>
  `;

  // Inject modal into DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Generate and display QR code
  generateMFAQRCode(enrollmentData);

  // Setup input validation
  const codeInput = document.getElementById('mfaVerificationCode');
  if (codeInput) {
    codeInput.addEventListener('input', (e) => {
      // Only allow digits
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
      
      // Auto-verify when 6 digits entered
      if (e.target.value.length === 6) {
        verifyMFASetup();
      }
    });
  }
}

// ── Generate MFA QR code ──
function generateMFAQRCode(enrollmentData) {
  try {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;

    // Use QRious library to generate QR code
    if (typeof QRious !== 'undefined') {
      new QRious({
        element: canvas,
        value: enrollmentData.totp.uri,
        size: 256,
        level: 'M'
      });
    } else {
      console.warn('QRious library not loaded');
      canvas.style.display = 'none';
      document.querySelector('[for="mfaVerificationCode"]').parentElement.insertAdjacentHTML(
        'beforeend',
        '<p style="color:var(--error);font-size:0.9rem;margin:1rem 0 0 0;">QR code generation failed. Please use manual entry.</p>'
      );
    }
  } catch (error) {
    console.error('QR code generation error:', error);
  }
}

// ── Verify MFA setup ──
async function verifyMFASetup() {
  if (!window.supabaseClient || !mfaEnrollmentData) {
    showToast('Setup session expired. Please try again.', 'error');
    closeMFASetupModal();
    return;
  }

  const codeInput = document.getElementById('mfaVerificationCode');
  const verifyBtn = document.getElementById('verifyMfaBtn');
  const codeError = document.getElementById('mfaCodeError');

  if (!codeInput) return;

  const code = codeInput.value.trim();

  // Validate code
  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    if (codeError) {
      codeError.textContent = 'Please enter a valid 6-digit code';
      codeError.style.display = 'block';
    }
    return;
  }

  // Clear error
  if (codeError) {
    codeError.style.display = 'none';
  }

  // Disable button during verification
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
  }

  try {
    // Create challenge for verification
    const { data: challengeData, error: challengeError } = 
      await window.supabaseClient.auth.mfa.challenge({
        factorId: mfaEnrollmentData.id
      });

    if (challengeError) {
      throw challengeError;
    }

    // Verify the code
    const { data: verifyData, error: verifyError } = 
      await window.supabaseClient.auth.mfa.verify({
        factorId: mfaEnrollmentData.id,
        challengeId: challengeData.id,
        code: code
      });

    if (verifyError) {
      if (codeError) {
        codeError.textContent = 'Invalid code. Please try again.';
        codeError.style.display = 'block';
      }
      codeInput.value = '';
      if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify & Enable';
      }
      return;
    }

    // Success!
    showToast('Two-Factor Authentication enabled successfully! 🎉', 'success');
    closeMFASetupModal();
    mfaEnrollmentData = null;

    // Update status display
    setTimeout(() => {
      checkMFAStatus();
    }, 500);

  } catch (error) {
    console.error('MFA verification error:', error);
    if (codeError) {
      codeError.textContent = 'An error occurred. Please try again.';
      codeError.style.display = 'block';
    }
  } finally {
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify & Enable';
    }
  }
}

// ── Close MFA setup modal ──
function closeMFASetupModal() {
  const overlay = document.getElementById('mfaModalOverlay');
  if (overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
}

// ── Disable MFA ──
async function disableMFA(factorId) {
  if (!window.supabaseClient) {
    showToast('Supabase client not initialized', 'error');
    return;
  }

  if (!confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
    return;
  }

  try {
    const { error } = await window.supabaseClient.auth.mfa.unenroll({
      factorId: factorId
    });

    if (error) {
      showToast('Failed to disable 2FA: ' + error.message, 'error');
      return;
    }

    showToast('Two-Factor Authentication disabled', 'info');
    checkMFAStatus();
  } catch (error) {
    console.error('Disable MFA error:', error);
    showToast('An error occurred while disabling 2FA', 'error');
  }
}

// ── Toast notification ──
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

// ── Add fade-out animation ──
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
