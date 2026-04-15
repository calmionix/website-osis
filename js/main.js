/**
 * OSIS MTs DARUL HIKAM CIREBON - MAIN JAVASCRIPT
 * Modern, Clean, Premium UI/UX
 */

// ============================================
// THEME MANAGEMENT
// ============================================

const ThemeManager = {
  init() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeIcon = document.querySelector('.theme-icon');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.applyTheme(this.currentTheme);
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  },
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcon(theme);
    localStorage.setItem('theme', theme);
  },
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.currentTheme = newTheme;
    this.applyTheme(newTheme);
  },
  
  updateIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }
};

// ============================================
// NAVBAR MANAGEMENT
// ============================================

const NavbarManager = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (this.navbar) {
      this.handleScroll();
      window.addEventListener('scroll', () => this.handleScroll());
    }
    
    if (this.mobileMenuBtn && this.mobileMenu) {
      this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    if (this.mobileMenuClose) {
      this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
        if (!this.mobileMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
          this.closeMobileMenu();
        }
      }
    });
  },
  
  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  },
  
  toggleMobileMenu() {
    this.mobileMenu.classList.toggle('active');
    document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
  },
  
  closeMobileMenu() {
    this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// ============================================
// SCROLL ANIMATIONS
// ============================================

const ScrollAnimations = {
  init() {
    this.animatedElements = document.querySelectorAll('.scroll-animate');
    
    if (this.animatedElements.length === 0) return;
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    this.animatedElements.forEach(el => {
      this.observer.observe(el);
    });
  },
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
};

// ============================================
// BACK TO TOP BUTTON
// ============================================

const BackToTop = {
  init() {
    this.button = document.querySelector('.back-to-top');
    
    if (!this.button) return;
    
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
    
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  },
  
  handleScroll() {
    if (window.scrollY > 500) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
};

// ============================================
// REALTIME CLOCK
// ============================================

const RealtimeClock = {
  init() {
    this.clockElement = document.querySelector('.realtime-clock');
    
    if (!this.clockElement) return;
    
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  },
  
  updateClock() {
    const now = new Date();
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    this.clockElement.textContent = now.toLocaleDateString('id-ID', options);
  }
};

// ============================================
// COUNT UP ANIMATION
// ============================================

const CountUpAnimation = {
  init() {
    this.counters = document.querySelectorAll('[data-count]');
    
    if (this.counters.length === 0) return;
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );
    
    this.counters.forEach(counter => {
      this.observer.observe(counter);
    });
  },
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateCounter(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  },
  
  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString('id-ID');
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString('id-ID');
      }
    };
    
    updateCounter();
  }
};

// ============================================
// COMING SOON POPUP
// ============================================

const ComingSoonPopup = {
  init() {
    this.buttons = document.querySelectorAll('[data-coming-soon]');
    
    this.buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showPopup();
      });
    });
  },
  
  showPopup() {
    // Create popup if not exists
    let popup = document.querySelector('.coming-soon-popup');
    
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'coming-soon-popup';
      popup.innerHTML = `
        <div class="coming-soon-popup-overlay"></div>
        <div class="coming-soon-popup-content">
          <button class="coming-soon-popup-close">&times;</button>
          <div class="coming-soon-popup-icon">🚧</div>
          <h3 class="coming-soon-popup-title">Segera Hadir!</h3>
          <p class="coming-soon-popup-text">Fitur ini sedang dalam pengembangan dan akan segera tersedia.</p>
          <button class="btn btn-primary coming-soon-popup-btn">Mengerti</button>
        </div>
      `;
      document.body.appendChild(popup);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .coming-soon-popup {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .coming-soon-popup.active {
          opacity: 1;
          visibility: visible;
        }
        .coming-soon-popup-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }
        .coming-soon-popup-content {
          position: relative;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          text-align: center;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }
        .coming-soon-popup.active .coming-soon-popup-content {
          transform: scale(1);
        }
        .coming-soon-popup-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: 1.5rem;
          transition: all 0.2s ease;
        }
        .coming-soon-popup-close:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .coming-soon-popup-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        .coming-soon-popup-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .coming-soon-popup-text {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
      `;
      document.head.appendChild(style);
      
      // Event listeners
      popup.querySelector('.coming-soon-popup-close').addEventListener('click', () => this.hidePopup());
      popup.querySelector('.coming-soon-popup-btn').addEventListener('click', () => this.hidePopup());
      popup.querySelector('.coming-soon-popup-overlay').addEventListener('click', () => this.hidePopup());
    }
    
    // Show popup
    setTimeout(() => popup.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  },
  
  hidePopup() {
    const popup = document.querySelector('.coming-soon-popup');
    if (popup) {
      popup.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const SearchManager = {
  init() {
    this.searchForm = document.querySelector('.search-form');
    this.searchInput = document.querySelector('.search-input');
    this.searchResults = document.querySelector('.search-results');
    
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    }
  },
  
  handleSearch(e) {
    e.preventDefault();
    const query = this.searchInput.value.trim();
    
    if (!query) return;
    
    // Show coming soon results
    this.displayComingSoonResults(query);
  },
  
  displayComingSoonResults(query) {
    if (!this.searchResults) return;
    
    this.searchResults.innerHTML = `
      <div class="search-info">
        <p>Hasil pencarian untuk "<strong>${query}</strong>"</p>
      </div>
      <div class="search-result-item">
        <span class="badge badge-coming-soon">Coming Soon</span>
        <h4 class="search-result-title">Program OSIS</h4>
        <p class="search-result-excerpt">Program-program kegiatan OSIS MTs Darul Hikam Cirebon akan segera hadir.</p>
        <div class="search-result-meta">
          <span>📁 Program</span>
          <span>📅 Segera</span>
        </div>
      </div>
      <div class="search-result-item">
        <span class="badge badge-coming-soon">Coming Soon</span>
        <h4 class="search-result-title">Kegiatan Event</h4>
        <p class="search-result-excerpt">Daftar event dan kegiatan OSIS akan segera tersedia.</p>
        <div class="search-result-meta">
          <span>📁 Event</span>
          <span>📅 Segera</span>
        </div>
      </div>
      <div class="search-result-item">
        <span class="badge badge-coming-soon">Coming Soon</span>
        <h4 class="search-result-title">Dokumentasi Galeri</h4>
        <p class="search-result-excerpt">Foto-foto kegiatan OSIS akan segera diunggah.</p>
        <div class="search-result-meta">
          <span>📁 Galeri</span>
          <span>📅 Segera</span>
        </div>
      </div>
    `;
  }
};

// ============================================
// FORM HANDLING
// ============================================

const FormHandler = {
  init() {
    this.forms = document.querySelectorAll('form[data-form]');
    
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  },
  
  handleSubmit(e, form) {
    e.preventDefault();
    
    const formType = form.dataset.form;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Mengirim...';
    
    // Simulate form submission
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      // Show success message
      this.showNotification('success', 'Pesan berhasil dikirim! Terima kasih.');
      
      // Reset form
      form.reset();
    }, 1500);
  },
  
  showNotification(type, message) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
      <span class="notification-text">${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--bg-card);
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
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(150%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// ============================================
// MODAL MANAGEMENT
// ============================================

const ModalManager = {
  init() {
    this.modals = document.querySelectorAll('[data-modal]');
    this.modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    
    this.modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modalTrigger;
        this.openModal(modalId);
      });
    });
    
    // Close modal on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal(e.target);
      }
    });
    
    // Close modal on close button click
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        this.closeModal(modal);
      });
    });
  },
  
  openModal(modalId) {
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};

// ============================================
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavbarManager.init();
  ScrollAnimations.init();
  BackToTop.init();
  RealtimeClock.init();
  CountUpAnimation.init();
  ComingSoonPopup.init();
  SearchManager.init();
  FormHandler.init();
  ModalManager.init();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format date to Indonesian
function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('id-ID', options);
}

// Format number to Indonesian
function formatNumber(num) {
  return num.toLocaleString('id-ID');
}

// Export modules for global access
window.ThemeManager = ThemeManager;
window.NavbarManager = NavbarManager;
window.ComingSoonPopup = ComingSoonPopup;
