/**
 * YOGESH PORTFOLIO — INTERACTIVE LOGIC
 * Dynamic filtering, copy to clipboard, mobile menu, and active scroll spy
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSkillFilters();
  initEmailCopy();
  initContactForm();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
 * 1. Mobile Menu & Scroll Spy
 * -------------------------------------------------------------------------- */
function initNavbar() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile drawer
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Scroll Spy for active navigation highlight
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
 * 2. Interactive Skills Category Filter
 * -------------------------------------------------------------------------- */
function initSkillFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterTabs.length || !skillCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active tab style
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease-in-out';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
 * 3. Copy Email to Clipboard with Tooltip Feedback
 * -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('btn-copy-email');
  const copyBtnText = document.getElementById('copy-btn-text');
  const emailTextEl = document.getElementById('email-text');

  if (!copyBtn || !emailTextEl) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailTextEl.textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for non-https / file protocol
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      // Visual feedback
      copyBtnText.textContent = 'Copied!';
      copyBtn.style.background = 'rgba(16, 185, 129, 0.2)';
      copyBtn.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      copyBtn.style.color = '#34d399';

      setTimeout(() => {
        copyBtnText.textContent = 'Copy';
        copyBtn.style.background = '';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });
}

/* --------------------------------------------------------------------------
 * 4. Contact Form — Live Delivery to yogeshatwork04@gmail.com via FormSubmit
 * -------------------------------------------------------------------------- */
function initContactForm() {
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
    feedback.className = 'form-feedback';
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        `;

        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        feedback.style.color = '#34d399';
        feedback.textContent = `Thank you, ${name}! Your message has been sent to Yogesh's inbox.`;
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      submitBtn.innerHTML = `<span>Error Sending</span>`;
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      feedback.style.color = '#ef4444';
      feedback.textContent = 'Failed to send message. Please email directly at yogeshatwork04@gmail.com.';
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        `;
      }, 5000);
    }
  });
}

/* --------------------------------------------------------------------------
 * 5. Smooth Scroll Helper
 * -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
