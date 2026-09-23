/* =========================================================
   script.js
   Vanilla JavaScript only — no frameworks, no build tools.
   Organized into small, named functions, top to bottom.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  setFooterYear();
  setupMobileNav();
  setupContactForm();
  setupScrollReveal();
  setupStatCounters();
  setupEyeTracking();
});

/* ---------------------------------------------------------
   1. Footer year
   --------------------------------------------------------- */
function setFooterYear() {
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------------
   2. Mobile navigation menu
   --------------------------------------------------------- */
function setupMobileNav() {
  var toggleButton = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

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
   Static site — no backend. Validates in the browser, then
   opens a pre-filled mailto: so the message still reaches
   Princess's inbox. Swap the mailto step for a fetch() call
   to a form service later if you want it to send silently.
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
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

/* ---------------------------------------------------------
   4. Scroll reveal
   Adds/removes a class so CSS handles the actual animation.
   Respects prefers-reduced-motion (see style.css .reveal rule).
   --------------------------------------------------------- */
function setupScrollReveal() {
  var targets = document.querySelectorAll(
    '.service-card, .timeline-item, .why-list li, .skills-group, .stat'
  );
  if (!targets.length) return;

  targets.forEach(function (el) { el.classList.add('reveal'); });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
}

/* ---------------------------------------------------------
   5. Stat counters
   Counts each stat number up from 0 to its data-count-to
   value once it scrolls into view. Skips the animation (jumps
   straight to the final number) if reduced motion is on.
   --------------------------------------------------------- */
function setupStatCounters() {
  var counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-suffix') || '');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { observer.observe(el); });
}

function animateCount(el) {
  var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
  var suffix = el.getAttribute('data-suffix') || '';
  var duration = 900; // ms
  var startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var current = Math.round(progress * target);
    el.textContent = current + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

/* ---------------------------------------------------------
   6. Eye-tracking effect
   Moves only the two small pupil overlays (#eyeLeft, #eyeRight)
   a few pixels toward the cursor/touch point. Never moves,
   rotates, or distorts the photo itself.

   How it works:
   - Each pupil's base position comes from --eye-x/--eye-y
     (set as inline styles in index.html), which you calibrate
     to the real photo — see README.md.
   - On pointer move, we find the pointer's position relative
     to the center of the photo frame, normalize it to a
     -1..1 range, clamp it, and set --track-x/--track-y (small
     pixel offsets) via CSS variables. The actual movement is
     done by CSS `transition`, which is what keeps it smooth.
   - Disabled automatically if prefers-reduced-motion is on.
   - On touch devices, it responds while a finger is touching
     the photo, and recenters on touch end.
   --------------------------------------------------------- */
function setupEyeTracking() {
  var frame = document.getElementById('heroPhotoFrame');
  var eyeLeft = document.getElementById('eyeLeft');
  var eyeRight = document.getElementById('eyeRight');
  if (!frame || !eyeLeft || !eyeRight) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var MAX_X = 3; // max horizontal pupil travel, in pixels
  var MAX_Y = 2; // max vertical pupil travel, in pixels

  function updateEyes(clientX, clientY) {
    var rect = frame.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;

    var dx = clamp((clientX - centerX) / (rect.width / 2), -1, 1);
    var dy = clamp((clientY - centerY) / (rect.height / 2), -1, 1);

    var trackX = dx * MAX_X + 'px';
    var trackY = dy * MAX_Y + 'px';

    [eyeLeft, eyeRight].forEach(function (eye) {
      eye.style.setProperty('--track-x', trackX);
      eye.style.setProperty('--track-y', trackY);
    });
  }

  function resetEyes() {
    [eyeLeft, eyeRight].forEach(function (eye) {
      eye.style.setProperty('--track-x', '0px');
      eye.style.setProperty('--track-y', '0px');
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Desktop / mouse — track across the whole page so the eyes
  // orient toward the cursor even when it isn't directly over
  // the photo, then reset when the mouse leaves the window.
  window.addEventListener('mousemove', function (event) {
    updateEyes(event.clientX, event.clientY);
  });
  document.addEventListener('mouseleave', resetEyes);

  // Touch — respond while a finger is on the photo frame,
  // recenter as soon as it lifts.
  frame.addEventListener('touchmove', function (event) {
    if (event.touches && event.touches[0]) {
      updateEyes(event.touches[0].clientX, event.touches[0].clientY);
    }
  }, { passive: true });

  frame.addEventListener('touchend', resetEyes);
  frame.addEventListener('touchcancel', resetEyes);
}
