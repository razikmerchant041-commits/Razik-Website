/**
 * SHAHJI PRINTERS - Customer Authentication & Session Management Module
 * Handles Google Sign-In, Email Authentication, Persistent Session Storage,
 * and Order Attribution.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'shahji_user_session';
  let onAuthSuccessCallback = null;

  const Auth = {
    /**
     * Get current logged in user object or null
     */
    getUser: function () {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        const user = JSON.parse(data);
        return (user && user.loggedIn) ? user : null;
      } catch (e) {
        console.error('Error reading auth session:', e);
        return null;
      }
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn: function () {
      return !!this.getUser();
    },

    /**
     * Log in user and persist session
     */
    login: function (userData) {
      const user = {
        name: userData.name || 'Valued Customer',
        email: userData.email || 'customer@shahjiprinters.com',
        phone: userData.phone || '+91 98250 12345',
        company: userData.company || '',
        avatar: userData.avatar || null,
        provider: userData.provider || 'google',
        loggedIn: true,
        loggedInAt: new Date().toISOString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Failed to save session:', e);
      }

      this.updateUI();
      this.closeModal();

      if (typeof onAuthSuccessCallback === 'function') {
        onAuthSuccessCallback(user);
        onAuthSuccessCallback = null;
      }

      // Dispatch global event for other scripts
      window.dispatchEvent(new CustomEvent('shahjiAuthChange', { detail: { user: user } }));
      return user;
    },

    /**
     * Log out current user
     */
    logout: function () {
      localStorage.removeItem(STORAGE_KEY);
      this.updateUI();
      window.dispatchEvent(new CustomEvent('shahjiAuthChange', { detail: { user: null } }));
    },

    /**
     * Open Authentication Modal
     */
    openModal: function (callback) {
      if (typeof callback === 'function') {
        onAuthSuccessCallback = callback;
      }
      this.ensureModalDOM();
      const modal = document.getElementById('authModal');
      if (modal) {
        modal.classList.add('active');
      }
    },

    /**
     * Close Authentication Modal
     */
    closeModal: function () {
      const modal = document.getElementById('authModal');
      if (modal) {
        modal.classList.remove('active');
      }
    },

    /**
     * Create Auth Modal DOM if not present
     */
    ensureModalDOM: function () {
      if (document.getElementById('authModal')) return;

      const modalHTML = `
      <div class="modal-backdrop" id="authModal">
        <div class="modal-card auth-modal-card">
          <button class="modal-close-btn" id="closeAuthModalBtn">&times;</button>
          
          <div class="auth-modal-header">
            <div class="auth-brand-badge">
              <img src="images/logo/logo.png" alt="Shahji Printers" style="height: 36px; object-fit: contain;">
              <span>SHAHJI PRINTERS</span>
            </div>
            <h3 class="auth-title">Customer Account Sign In</h3>
            <p class="auth-subtitle">Sign in to place orders, upload artwork files, and save order history automatically.</p>
          </div>

          <!-- Fast Google Sign-In Section -->
          <div class="auth-section-google">
            <button type="button" class="btn-google-auth" id="googleSignInBtn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google Account</span>
            </button>
            <div class="auth-divider"><span>OR SIGN IN WITH EMAIL</span></div>
          </div>

          <!-- Manual Email / Account Form -->
          <form id="manualAuthForm" class="auth-form">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" id="authInputName" class="form-control" placeholder="e.g. Rajesh Shah" required>
            </div>
            <div class="form-group">
              <label>Email Address *</label>
              <input type="email" id="authInputEmail" class="form-control" placeholder="name@domain.com" required>
            </div>
            <div class="form-group">
              <label>Mobile Number (for Order Updates) *</label>
              <input type="tel" id="authInputPhone" class="form-control" placeholder="+91 98250 XXXXX" required>
            </div>
            <div class="form-group">
              <label>Firm / Company Name (Optional)</label>
              <input type="text" id="authInputCompany" class="form-control" placeholder="Business Name">
            </div>

            <div class="form-check" style="margin: 10px 0 16px 0; font-size: 0.78rem;">
              <label style="cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" id="authRememberMe" checked> Remember me on this device
              </label>
            </div>

            <button type="submit" class="btn btn-orange" style="width: 100%; font-size: 0.9rem;">
              <i class="fas fa-sign-in-alt"></i> Complete Sign In & Continue
            </button>
          </form>
        </div>
      </div>`;

      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Attach Modal Controls
      document.getElementById('closeAuthModalBtn').addEventListener('click', () => this.closeModal());
      document.getElementById('authModal').addEventListener('click', (e) => {
        if (e.target.id === 'authModal') this.closeModal();
      });

      // Google Sign-In Handler
      document.getElementById('googleSignInBtn').addEventListener('click', () => {
        // Quick interactive Google Login prompt simulation
        const sampleGoogleAccounts = [
          { name: 'Shahji Print Client', email: 'client.shahji@gmail.com', phone: '+91 98250 12345' },
          { name: 'Rajesh Patel', email: 'rajesh.patel@gmail.com', phone: '+91 98980 44321' }
        ];
        
        const chosen = sampleGoogleAccounts[Math.floor(Math.random() * sampleGoogleAccounts.length)];
        const userEmail = prompt('Google Account Sign-In:\nEnter your Google Email address:', chosen.email);
        
        if (userEmail) {
          const userName = userEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
          this.login({
            name: userName || 'Google User',
            email: userEmail,
            phone: chosen.phone,
            provider: 'google',
            avatar: 'G'
          });
        }
      });

      // Manual Form Handler
      document.getElementById('manualAuthForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('authInputName').value.trim();
        const email = document.getElementById('authInputEmail').value.trim();
        const phone = document.getElementById('authInputPhone').value.trim();
        const company = document.getElementById('authInputCompany').value.trim();

        if (name && email && phone) {
          this.login({
            name: name,
            email: email,
            phone: phone,
            company: company,
            provider: 'email'
          });
        }
      });
    },

    /**
     * Update UI elements across page according to current auth state
     */
    updateUI: function () {
      const user = this.getUser();

      // 1. Remove top-bar auth slot near email ID if present
      const topBarAuthSlot = document.getElementById('topBarAuthSlot');
      if (topBarAuthSlot) {
        topBarAuthSlot.remove();
      }

      // 1b. Main Header Action Auth Slot
      const headerAuthContainer = document.getElementById('headerAuthBtnSlot');
      if (headerAuthContainer) {
        if (user) {
          headerAuthContainer.innerHTML = `
            <div class="user-chip-header" id="hdrUserChipBtn" title="${user.email}">
              <i class="fas fa-user-circle" style="color: var(--accent-orange);"></i>
              <span>Hi, ${user.name.split(' ')[0]}</span>
              <button type="button" id="hdrLogoutBtn" title="Sign Out" style="background: none; border: none; color: #94a3b8; cursor: pointer; margin-left: 4px; font-size: 0.72rem;">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>`;
          const hdrLogout = document.getElementById('hdrLogoutBtn');
          if (hdrLogout) hdrLogout.addEventListener('click', (e) => { e.stopPropagation(); this.logout(); });
        } else {
          headerAuthContainer.innerHTML = `
            <button type="button" class="btn-header-signin" id="hdrSignInBtn">
              <i class="fab fa-google"></i> <span>Sign In</span>
            </button>`;
          const hdrSignIn = document.getElementById('hdrSignInBtn');
          if (hdrSignIn) hdrSignIn.addEventListener('click', () => this.openModal());
        }
      }

      // 2. Configurator Order Page User Status Box
      const configUserContainer = document.getElementById('configUserAuthCardSlot');
      if (configUserContainer) {
        if (user) {
          configUserContainer.innerHTML = `
            <div class="config-section-title"><i class="fas fa-user-check" style="color: var(--accent-orange);"></i> Customer Account</div>
            <div class="user-auth-badge-card">
              <div class="auth-card-left">
                <div class="user-avatar-circle">
                  ${user.name.charAt(0).toUpperCase()}
                </div>
                <div class="user-details-text">
                  <div class="user-name-title">${user.name} ${user.company ? '(' + user.company + ')' : ''}</div>
                  <div class="user-meta-sub">${user.email} • ${user.phone}</div>
                </div>
              </div>
              <div class="auth-card-right">
                <span class="badge-status-logged"><i class="fas fa-check-circle"></i> Logged In</span>
                <button type="button" id="cfgSwitchUserBtn" class="btn-switch-account">Switch</button>
              </div>
            </div>`;
          const switchBtn = document.getElementById('cfgSwitchUserBtn');
          if (switchBtn) switchBtn.addEventListener('click', () => this.openModal());
        } else {
          configUserContainer.innerHTML = `
            <div class="config-section-title"><i class="fas fa-user-lock" style="color: var(--accent-orange);"></i> Customer Account</div>
            <div class="user-auth-prompt-card">
              <div class="auth-card-left">
                <i class="fab fa-google google-icon-brand"></i>
                <div class="user-details-text">
                  <div class="user-name-title">Sign In Required to Place Order</div>
                  <div class="user-meta-sub">Log in with your Google or Email account to attach your contact details.</div>
                </div>
              </div>
              <div class="auth-card-right">
                <button type="button" id="cfgSignInBtn" class="btn btn-orange btn-sm btn-signin-trigger">
                  <i class="fab fa-google"></i> Sign In / Sign Up
                </button>
              </div>
            </div>`;
          const signInBtn = document.getElementById('cfgSignInBtn');
          if (signInBtn) signInBtn.addEventListener('click', () => this.openModal());
        }
      }
    }
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    Auth.updateUI();
  });

  window.ShahjiAuth = Auth;
})(window);
