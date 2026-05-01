/* ============================================================
   Verde — app.js
   Shared JavaScript: Home | Gallery | About | Contact
   ============================================================ */

'use strict';

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => io.observe(el));
}

/* ============================================================
   SKILL BARS (about.html)
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.sk-fill');
  if (!bars.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // small delay so the reveal animation plays first
          setTimeout(() => e.target.classList.add('go'), 200);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach((b) => io.observe(b));
}

/* ============================================================
   GALLERY FILTER (gallery.html)
   ============================================================ */
function initGalleryFilter() {
  const btns  = document.querySelectorAll('.gf-btn');
  const items = document.querySelectorAll('.g-item');
  if (!btns.length || !items.length) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;

      items.forEach((item) => {
        const matches = f === 'all' || item.dataset.filter === f;

        if (matches) {
          item.style.display = '';
          // force reflow then fade in
          void item.offsetWidth;
          item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          item.style.opacity   = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          item.style.opacity    = '0';
          item.style.transform  = 'scale(0.93)';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 280);
        }
      });
    });
  });
}

/* ============================================================
   LIGHTBOX (gallery.html)
   ============================================================ */
function initLightbox() {
  const lb      = document.getElementById('lb');
  const lbImg   = document.getElementById('lbImg');
  const lbCap   = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const items   = document.querySelectorAll('.g-item');
  if (!lb || !lbImg) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      // Use high-res src stored in data-src, fallback to img src
      const src   = item.dataset.src || item.querySelector('img')?.src || '';
      const alt   = item.querySelector('img')?.alt || '';
      const label = item.dataset.label || alt;

      lbImg.src = src;
      lbImg.alt = alt;
      if (lbCap) lbCap.textContent = label;

      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    // clear src after animation
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  if (lbClose) lbClose.addEventListener('click', closeLb);

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLb();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
  });
}

/* ============================================================
   CONTACT FORM → GMAIL MAILTO (contact.html)
   ============================================================ */
function initContact() {
  const sendBtn = document.getElementById('sendBtn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const name    = trim('iName');
    const email   = trim('iEmail');
    const subject = trim('iSubject');
    const msg     = trim('iMsg');

    // Validate
    let hasError = false;
    if (!name)          { markError('iName');  hasError = true; }
    if (!validEmail(email)) { markError('iEmail'); hasError = true; }
    if (!msg)           { markError('iMsg');   hasError = true; }
    if (hasError) return;

    // ============================================================
    //  ✏️  CHANGE: replace with your actual Gmail address
    // ============================================================
    const TO = 'yourname@gmail.com';

    const body   = `Hi Admin,\n\nMy name is ${name} (${email}).\n\n${msg}\n\nSent from the Hinnom Rock website.`;
    const mailto = `mailto:${TO}?subject=${enc(subject || 'Message from Hinnom Rock Website')}&body=${enc(body)}`;

    window.location.href = mailto;

    // Show success after a short delay (Gmail takes a moment to open)
    setTimeout(() => {
      const formBody = document.getElementById('formBody');
      const success  = document.getElementById('formSuccess');
      if (formBody && success) {
        formBody.style.display = 'none';
        success.classList.add('show');
      }
    }, 700);
  });

  // Remove error styling on input
  ['iName', 'iEmail', 'iSubject', 'iMsg'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        el.style.borderColor = '';
        el.style.animation   = '';
      });
    }
  });
}

/* helpers */
function trim(id)  { return (document.getElementById(id)?.value || '').trim(); }
function enc(s)    { return encodeURIComponent(s); }
function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function markError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('error');
  // re-trigger animation if already applied
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSkillBars();
  initGalleryFilter();
  initLightbox();
  initContact();
});