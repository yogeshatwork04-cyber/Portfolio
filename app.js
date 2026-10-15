/**
 * YOGESH PORTFOLIO — SERENE MINIMALIST INTERACTIVITY
 * Light/Dark theme toggle, floating nav active states, contact modal, and FormSubmit AJAX delivery
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initContactModal();
  initFormSubmit();
});

/* --------------------------------------------------------------------------
 * 1. Light / Dark Theme Toggle
 * -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  // Load saved preference or default to light (as shown in reference screenshot)
  const savedTheme = localStorage.getItem('theme-preference') || 'light';
  root.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme-preference', nextTheme);
    });
  }
}

/* --------------------------------------------------------------------------
 * 2. Floating Pill Navigation Scroll Spy
 * -------------------------------------------------------------------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-pill-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = 'home';
    const scrollPos = window.pageYOffset + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
 * 3. Contact Modal Open / Close Logic
 * -------------------------------------------------------------------------- */
function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const openHeroBtn = document.getElementById('btn-hero-contact');
  const openConnectBtn = document.getElementById('btn-connect-open');
  const closeBtn = document.getElementById('modal-close-btn');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const nameInput = document.getElementById('form-name');
      if (nameInput) nameInput.focus();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openHeroBtn) openHeroBtn.addEventListener('click', openModal);
  if (openConnectBtn) openConnectBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
}

/* --------------------------------------------------------------------------
 * 4. FormSubmit AJAX Delivery to yogeshatwork04@gmail.com
 * -------------------------------------------------------------------------- */
function initFormSubmit() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback-msg');
  const submitBtn = document.getElementById('btn-submit-message');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    feedback.className = 'form-status-msg';
    feedback.style.display = 'none';

    try {
      const response = await fetch('https://formsubmit.co/ajax/yogeshatwork04@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      });

      const data = await response.json();

      if (response.ok || data.success === 'true' || data.success === true) {
        form.reset();
        submitBtn.innerHTML = `
          <span>Message Sent!</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        `;

        feedback.className = 'form-status-msg success';
        feedback.textContent = `Thank you, ${name}! Your note has been delivered to Yogesh's inbox.`;

        setTimeout(() => {
          const modal = document.getElementById('contact-modal');
          if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
          }
        }, 3000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact error:', err);
      submitBtn.innerHTML = `<span>Try Again</span>`;
      feedback.className = 'form-status-msg error';
      feedback.textContent = 'Failed to send message. Please email directly at yogeshatwork04@gmail.com.';
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        `;
      }, 5000);
    }
  });
}
