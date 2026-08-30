/* =========================================================
   script.js
   Vanilla JavaScript only — no frameworks, no build tools.
   Everything here is organized into small, named functions
   so it's easy to read top to bottom.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  setFooterYear();
  setupMobileNav();
  setupContactForm();
  setupScrollReveal();
});

/* ---------------------------------------------------------
   1. Footer year
   Keeps the copyright year correct without editing the HTML.
   --------------------------------------------------------- */
function setFooterYear() {
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------------
   2. Mobile navigation menu
   Toggles the nav open/closed on small screens and closes it
   again whenever a link is clicked (so tapping "Contact"
   doesn't leave the menu open over the section below it).
   --------------------------------------------------------- */
function setupMobileNav() {
  var toggleButton = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu after choosing a link (mobile only, but harmless on desktop)
  var navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   3. Contact form validation
   This site is static (HTML/CSS/JS only, no server), so the
   form does NOT actually send an email on its own. It:
     - validates the fields in the browser
     - on success, opens the visitor's email app with a
       pre-filled message via a "mailto:" link

   If you later want the form to send messages without
   opening an email app, you'd connect it to a form service
   (e.g. Formspree) or your own backend — that's a separate
   step beyond plain HTML/CSS/JS.
   --------------------------------------------------------- */
function setupContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var nameField = document.getElementById('name');
  var emailField = document.getElementById('email');
  var messageField = document.getElementById('message');
  var statusEl = document.getElementById('formStatus');

  var CONTACT_EMAIL = 'prvalenzuela05@gmail.com';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var isValid = true;
    isValid = validateField(nameField, 'nameError', function (value) {
      return value.trim().length > 0 ? '' : 'Please enter your name.';
    }) && isValid;

    isValid = validateField(emailField, 'emailError', function (value) {
      return isValidEmail(value) ? '' : 'Please enter a valid email address.';
    }) && isValid;

    isValid = validateField(messageField, 'messageError', function (value) {
      return value.trim().length > 0 ? '' : 'Please enter a message.';
    }) && isValid;

    if (!isValid) {
      statusEl.textContent = 'Please fix the highlighted fields.';
      statusEl.classList.remove('success');
      return;
    }

    // Build a pre-filled email and open the visitor's mail app
    var subject = 'Website inquiry from ' + nameField.value.trim();
    var body =
      'Name: ' + nameField.value.trim() + '\n' +
      'Email: ' + emailField.value.trim() + '\n\n' +
      messageField.value.trim();

    var mailtoLink =
      'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailtoLink;

    statusEl.textContent = 'Opening your email app to send this message...';
    statusEl.classList.add('success');
  });

  // Clear a field's error as soon as the visitor starts fixing it
  [nameField, emailField, messageField].forEach(function (field) {
    field.addEventListener('input', function () {
      field.closest('.form-field').classList.remove('has-error');
    });
  });
}

function validateField(field, errorId, validate) {
  var errorEl = document.getElementById(errorId);
  var message = validate(field.value);

  if (message) {
    field.closest('.form-field').classList.add('has-error');
    errorEl.textContent = message;
    return false;
  }

  field.closest('.form-field').classList.remove('has-error');
  errorEl.textContent = '';
  return true;
}

function isValidEmail(value) {
  // Simple, readable email check — good enough for frontend validation.
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

/* ---------------------------------------------------------
   4. Scroll reveal
   A small, tasteful fade/slide-in for cards and timeline
   items as they enter the viewport. Uses IntersectionObserver
   so it's cheap and doesn't run on every scroll event.
   Respects users who've asked for reduced motion.
   --------------------------------------------------------- */
function setupScrollReveal() {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var targets = document.querySelectorAll(
    '.service-card, .timeline-item, .why-list li, .skills-group'
  );
  if (!targets.length || !('IntersectionObserver' in window)) return;

  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}
