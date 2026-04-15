/**
 * OSIS MTs DARUL HIKAM CIREBON - FIREBASE AUTHENTICATION
 * Google OAuth Authentication
 */

// ============================================
// FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForOSISDarulHikam",
  authDomain: "osis-darulhikam.firebaseapp.com",
  projectId: "osis-darulhikam",
  storageBucket: "osis-darulhikam.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// ============================================
// AUTHENTICATION MANAGER
// ============================================

const AuthManager = {
  // Allowed admin email
  ALLOWED_ADMIN_EMAIL: 'calmionix@gmail.com',
  
  init() {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
      console.warn('Firebase not loaded. Auth functionality disabled.');
      this.handleMockAuth();
      return;
    }
    
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    this.auth = firebase.auth();
    this.provider = new firebase.auth.GoogleAuthProvider();
    
    // Setup UI
    this.setupAuthUI();
    
    // Listen for auth state changes
    this.auth.onAuthStateChanged((user) => this.handleAuthStateChange(user));
  },
  
  setupAuthUI() {
    this.loginBtn = document.querySelector('.login-btn');
    this.userMenu = document.querySelector('.user-menu');
    
    if (this.loginBtn) {
      this.loginBtn.addEventListener('click', () => this.signIn());
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.signOut());
    }
  },
  
  async signIn() {
    try {
      const result = await this.auth.signInWithPopup(this.provider);
      const user = result.user;
      
      // Check if user is allowed
      if (user.email !== this.ALLOWED_ADMIN_EMAIL) {
        await this.auth.signOut();
        this.showError('Akses ditolak. Email tidak memiliki izin.');
        return;
      }
      
      // Store user data
      this.storeUserData(user);
      
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard.html';
      
    } catch (error) {
      console.error('Sign in error:', error);
      this.showError('Gagal masuk. Silakan coba lagi.');
    }
  },
  
  async signOut() {
    try {
      await this.auth.signOut();
      this.clearUserData();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
  
  handleAuthStateChange(user) {
    if (user) {
      // User is signed in
      if (user.email === this.ALLOWED_ADMIN_EMAIL) {
        this.updateUIForLoggedInUser(user);
        
        // If on admin page, verify access
        if (window.location.pathname.startsWith('/admin/')) {
          this.storeUserData(user);
        }
      } else {
        // Not authorized
        this.auth.signOut();
        this.showError('Email tidak memiliki akses admin.');
      }
    } else {
      // User is signed out
      this.updateUIForLoggedOutUser();
      
      // Redirect if on admin page
      if (window.location.pathname.startsWith('/admin/')) {
        window.location.href = '/?login=required';
      }
    }
  },
  
  updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    const userMenu = document.querySelector('.user-menu');
    
    if (loginBtn) {
      loginBtn.innerHTML = `
        <img src="${user.photoURL || '/assets/images/default-avatar.png'}" alt="${user.displayName}" class="user-avatar">
        <span class="hidden sm:inline">${user.displayName?.split(' ')[0] || 'Admin'}</span>
      `;
      loginBtn.classList.add('user-logged-in');
    }
    
    // Update admin sidebar if exists
    const adminUserName = document.querySelector('.admin-user-name');
    const adminUserEmail = document.querySelector('.admin-user-email');
    const adminUserAvatar = document.querySelector('.admin-user-avatar');
    
    if (adminUserName) adminUserName.textContent = user.displayName || 'Admin';
    if (adminUserEmail) adminUserEmail.textContent = user.email;
    if (adminUserAvatar) adminUserAvatar.src = user.photoURL || '/assets/images/default-avatar.png';
  },
  
  updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.login-btn');
    
    if (loginBtn) {
      loginBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span>Login</span>
      `;
      loginBtn.classList.remove('user-logged-in');
    }
  },
  
  storeUserData(user) {
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem('osis_admin_user', JSON.stringify(userData));
  },
  
  clearUserData() {
    sessionStorage.removeItem('osis_admin_user');
  },
  
  getStoredUser() {
    const userData = sessionStorage.getItem('osis_admin_user');
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated() {
    return !!this.getStoredUser();
  },
  
  showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.innerHTML = `
      <span class="notification-icon">❌</span>
      <span class="notification-text">${message}</span>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--bg-card);
      border: 1px solid var(--error);
      border-radius: var(--radius-lg);
      padding: 1rem 1.5rem;
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 9999;
      transform: translateX(150%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(150%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  },
  
  // Mock auth for development without Firebase
  handleMockAuth() {
    const loginBtn = document.querySelector('.login-btn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        // Show coming soon popup for login
        if (window.ComingSoonPopup) {
          window.ComingSoonPopup.showPopup();
        } else {
          alert('Fitur login akan segera hadir!');
        }
      });
    }
  }
};

// ============================================
// ADMIN PROTECTION
// ============================================

const AdminProtection = {
  init() {
    // Check if on admin page
    if (!window.location.pathname.startsWith('/admin/')) return;
    
    // Check authentication
    const user = AuthManager.getStoredUser();
    
    if (!user) {
      // Not authenticated, redirect to login
      window.location.href = '/?login=required';
      return;
    }
    
    // Verify email
    if (user.email !== AuthManager.ALLOWED_ADMIN_EMAIL) {
      sessionStorage.removeItem('osis_admin_user');
      window.location.href = '/?unauthorized=true';
      return;
    }
    
    // User is authenticated, update UI
    this.updateAdminUI(user);
  },
  
  updateAdminUI(user) {
    // Update sidebar user info
    const adminUserName = document.querySelector('.admin-user-name');
    const adminUserEmail = document.querySelector('.admin-user-email');
    const adminUserAvatar = document.querySelector('.admin-user-avatar');
    
    if (adminUserName) adminUserName.textContent = user.displayName || 'Admin';
    if (adminUserEmail) adminUserEmail.textContent = user.email;
    if (adminUserAvatar) adminUserAvatar.src = user.photoURL || '/assets/images/default-avatar.png';
  }
};

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
  AdminProtection.init();
});

// Export for global access
window.AuthManager = AuthManager;
window.AdminProtection = AdminProtection;
