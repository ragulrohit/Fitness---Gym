document.addEventListener('DOMContentLoaded', () => {
  // ===== OPENING LOGO LOADER =====
  const siteLoader = document.querySelector('.site-loader');

  if (siteLoader) {
    let loaderFinished = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loaderDelay = prefersReducedMotion ? 350 : 5000;

    const finishLoader = () => {
      if (loaderFinished) return;
      loaderFinished = true;

      setTimeout(() => {
        document.body.classList.remove('is-loading');
        siteLoader.classList.add('hide');
        setTimeout(() => siteLoader.remove(), 600);
      }, loaderDelay);
    };

    if (document.readyState === 'complete') {
      finishLoader();
    } else {
      window.addEventListener('load', finishLoader, { once: true });
      setTimeout(finishLoader, 3000);
    }
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== MOBILE HAMBURGER MENU =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // ===== CLOSE MENU ON LINK CLICK =====
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== LOGIN FORM VALIDATION =====
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const username = document.getElementById('username');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const usernameError = document.getElementById('usernameError');
      const emailError = document.getElementById('emailError');
      const passwordError = document.getElementById('passwordError');
      const usernameGroup = username.closest('.form-group');
      const emailGroup = email.closest('.form-group');
      const passwordGroup = password.closest('.form-group');

      // Reset
      usernameGroup.classList.remove('error');
      emailGroup.classList.remove('error');
      passwordGroup.classList.remove('error');

      // Validate username
      if (!username.value.trim()) {
        usernameError.textContent = 'Username is required';
        usernameGroup.classList.add('error');
        valid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        emailGroup.classList.add('error');
        valid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email';
        emailGroup.classList.add('error');
        valid = false;
      }

      // Validate password
      if (!password.value.trim()) {
        passwordError.textContent = 'Password is required';
        passwordGroup.classList.add('error');
        valid = false;
      } else if (password.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordGroup.classList.add('error');
        valid = false;
      }

      if (valid) {
        // Simulate login
        const btn = loginForm.querySelector('.btn');
        localStorage.setItem('fitbodyUsername', username.value.trim());
        btn.textContent = 'Signing In...';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = 'Sign In';
          btn.disabled = false;
          showToast('Welcome back! Redirecting...', 'success');
          loginForm.reset();
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 700);
        }, 1500);
      }
    });
  }

  // ===== DASHBOARD USERNAME =====
  const dashboardUsername = document.getElementById('dashboardUsername');

  if (dashboardUsername) {
    const savedUsername = localStorage.getItem('fitbodyUsername');
    dashboardUsername.textContent = savedUsername || 'Username';
  }

  document.querySelectorAll('.sidebar-username').forEach(usernameEl => {
    const savedUsername = localStorage.getItem('fitbodyUsername');
    usernameEl.textContent = savedUsername || 'Username';
  });

  // ===== DASHBOARD LOGOUT CONFIRMATION =====
  const logoutLinks = document.querySelectorAll('.health-logout');

  if (logoutLinks.length) {
    const modal = document.createElement('div');
    modal.className = 'logout-modal';
    modal.innerHTML = `
      <div class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logoutTitle">
        <h2 id="logoutTitle">Log Out?</h2>
        <p>Are you sure you want to leave your dashboard?</p>
        <div class="logout-actions">
          <button type="button" class="btn btn-outline" id="cancelLogout">Cancel</button>
          <button type="button" class="btn btn-primary" id="confirmLogout">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeLogoutModal = () => modal.classList.remove('open');

    logoutLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        modal.classList.add('open');
      });
    });

    modal.querySelector('#cancelLogout').addEventListener('click', closeLogoutModal);
    modal.querySelector('#confirmLogout').addEventListener('click', () => {
      window.location.href = 'login.html';
    });

    modal.addEventListener('click', event => {
      if (event.target === modal) closeLogoutModal();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeLogoutModal();
    });
  }

  // ===== SIGNUP FORM VALIDATION =====
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const confirm = document.getElementById('confirmPassword');

      const fields = [
        { el: name, id: 'nameError', msg: 'Name is required' },
        { el: email, id: 'emailError', msg: 'Email is required', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, regexMsg: 'Enter a valid email' },
        { el: password, id: 'passwordError', msg: 'Password is required', min: 6, minMsg: 'At least 6 characters' },
        { el: confirm, id: 'confirmError', msg: 'Please confirm your password' }
      ];

      fields.forEach(f => {
        const group = f.el.closest('.form-group');
        const errorEl = document.getElementById(f.id);
        group.classList.remove('error');

        if (!f.el.value.trim()) {
          errorEl.textContent = f.msg;
          group.classList.add('error');
          valid = false;
        } else if (f.regex && !f.regex.test(f.el.value.trim())) {
          errorEl.textContent = f.regexMsg;
          group.classList.add('error');
          valid = false;
        } else if (f.min && f.el.value.length < f.min) {
          errorEl.textContent = f.minMsg;
          group.classList.add('error');
          valid = false;
        }
      });

      if (password.value !== confirm.value) {
        const group = confirm.closest('.form-group');
        const errorEl = document.getElementById('confirmError');
        errorEl.textContent = 'Passwords do not match';
        group.classList.add('error');
        valid = false;
      }

      if (valid) {
        const btn = signupForm.querySelector('.btn');
        btn.textContent = 'Creating Account...';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = 'Create Account';
          btn.disabled = false;
          showToast('Account created! Welcome to FitBody.', 'success');
          signupForm.reset();
        }, 1500);
      }
    });
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '16px 28px',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: '600',
      zIndex: '9999',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
    });

    if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
    } else {
      toast.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
    }

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== SCROLL REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll('.program-card, .program-detail-card, .trainer-card, .pricing-card, .testimonial-card, .about-grid, .hero-stats');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.6s ease';
    revealObserver.observe(el);
  });
});
