/* ==========================================================================
   Jesus Way To Life Church — script.js
   Vanilla JS: navigation, scroll reveals, verse of the day, sermons,
   gallery lightbox, testimonial slider, and validated forms.

   ------------------------------------------------------------------
   INTEGRATION POINTS (edit these to go live):
   1. FORM_ENDPOINT — set a URL for your backend / form-email service
      (e.g. Formspree, EmailJS, or your own API). Until it is set, both
      forms run in demo mode: they validate input but do not send data.
   2. SERMONS — replace sample data with your real sermons. Set a
      YouTube video ID (`youtubeId`) per sermon to enable embedded playback.
   3. EVENTS / MINISTRIES text lives in index.html.
   ========================================================================== */

'use strict';

document.documentElement.classList.add('js');

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const FORM_ENDPOINT = null; // e.g. 'https://formspree.io/f/your-id' — null = demo mode

const SERMONS = [
  {
    title: 'The Way, The Truth, The Life',
    speaker: '[Speaker Name]',
    date: 'Sample date',
    description: 'An exploration of John 14 and what it means that Jesus alone is the way to the Father — and to abundant life.',
    thumbnail: 'assets/gallery-worship.png',
    youtubeId: null // e.g. 'dQw4w9WgXcQ' — set to embed a real YouTube video
  },
  {
    title: 'Finding Peace in Troubled Times',
    speaker: '[Speaker Name]',
    date: 'Sample date',
    description: 'Where does a believer find true peace when the world shakes? A message on trust, prayer, and the presence of God.',
    thumbnail: 'assets/gallery-prayer.png',
    youtubeId: null
  },
  {
    title: 'Faith That Moves Mountains',
    speaker: '[Speaker Name]',
    date: 'Sample date',
    description: 'Jesus promised that faith even the size of a mustard seed can move mountains. A call to bold, expectant prayer.',
    thumbnail: 'assets/gallery-celebration.png',
    youtubeId: null
  },
  {
    title: 'Loved With an Everlasting Love',
    speaker: '[Speaker Name]',
    date: 'Sample date',
    description: 'Understanding the unconditional love of God — how it heals, restores, and sends us out to love others.',
    thumbnail: 'assets/welcome.png',
    youtubeId: null
  },
  {
    title: 'Serving Like Jesus',
    speaker: '[Speaker Name]',
    date: 'Sample date',
    description: 'Christ washed the feet of His disciples. What does servant-hearted leadership look like in our homes and church?',
    thumbnail: 'assets/gallery-outreach.png',
    youtubeId: null
  },
  {
    title: 'Hope for the Next Generation',
    speaker: '[Speaker Name]',
    date: 'Sample date',
    description: 'Raising children and young people who know Jesus — partnering with God in the work of the next generation.',
    thumbnail: 'assets/sermon-youth.png',
    youtubeId: null
  }
];

const VERSES = [
  {
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    ref: 'Jeremiah 29:11',
    note: "Whatever today holds, God's plan for you is good. Walk in it with confidence."
  },
  {
    text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    ref: 'Joshua 1:9',
    note: 'You never face this day alone — He goes before you and stands beside you.'
  },
  {
    text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    ref: 'Psalm 23:1–3',
    note: 'In His care there is rest. Let Him refresh your soul today.'
  },
  {
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    ref: 'Matthew 11:28',
    note: 'Whatever you are carrying, bring it to Jesus — His invitation stands.'
  },
  {
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    ref: 'Romans 8:28',
    note: 'Nothing is wasted in the hands of God. He is working, even now.'
  },
  {
    text: 'Do not let your hearts be troubled. You believe in God; believe also in me.',
    ref: 'John 14:1',
    note: 'Peace is not the absence of trouble — it is the presence of Christ.'
  },
  {
    text: 'The joy of the Lord is your strength.',
    ref: 'Nehemiah 8:10',
    note: 'His joy carries you further than your own strength ever could.'
  }
];

/* ------------------------------------------------------------------ */
/*  Header: solid on scroll, hide on scroll down                       */
/* ------------------------------------------------------------------ */

const header = document.getElementById('site-header');
const toTop = document.getElementById('to-top');
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);

  if (y > 500 && y > lastY + 6) {
    header.classList.add('header-hidden');
  } else if (y < lastY - 4 || y < 120) {
    header.classList.remove('header-hidden');
  }
  lastY = y;

  toTop.classList.toggle('show', y > 700);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ------------------------------------------------------------------ */
/*  Mobile navigation                                                  */
/* ------------------------------------------------------------------ */

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
  setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});
navMenu.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    setMenu(false);
    navToggle.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 880) setMenu(false);
});

/* ------------------------------------------------------------------ */
/*  Scroll spy: highlight active nav link                              */
/* ------------------------------------------------------------------ */

const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const spyTargets = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-38% 0px -55% 0px' });
spyTargets.forEach((t) => spy.observe(t));

/* ------------------------------------------------------------------ */
/*  Scroll reveals                                                     */
/* ------------------------------------------------------------------ */

const revealEls = document.querySelectorAll('.reveal');
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Gentle stagger for elements entering together
      entry.target.style.transitionDelay = `${Math.min(i * 70, 350)}ms`;
      entry.target.classList.add('visible');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => revealer.observe(el));

/* ------------------------------------------------------------------ */
/*  Verse of the day (stable per calendar day)                         */
/* ------------------------------------------------------------------ */

(function verseOfTheDay() {
  const now = new Date();
  const dayIndex = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const verse = VERSES[dayIndex % VERSES.length];
  document.getElementById('verse-text').textContent = verse.text;
  document.getElementById('verse-ref').textContent = '— ' + verse.ref;
  document.getElementById('verse-note').textContent = verse.note;
})();

/* ------------------------------------------------------------------ */
/*  Sermons: render cards + "View All" + watch modal                   */
/* ------------------------------------------------------------------ */

const sermonGrid = document.getElementById('sermon-grid');
const INITIAL_SERMONS = 3;
let sermonsExpanded = false;

function sermonCard(s, index) {
  const hidden = index >= INITIAL_SERMONS ? ' style="display:none"' : '';
  return `
  <article class="sermon-card reveal visible" data-sermon="${index}"${hidden}>
    <div class="sermon-thumb">
      <img src="${s.thumbnail}" alt="${s.title} — sermon thumbnail" loading="lazy">
      <button class="sermon-play" aria-label="Watch sermon: ${s.title}"><i class="fa-solid fa-circle-play" aria-hidden="true"></i></button>
    </div>
    <div class="sermon-body">
      <p class="sermon-meta"><span><i class="fa-solid fa-user" aria-hidden="true"></i> ${s.speaker}</span><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${s.date}</span></p>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
      <button class="btn-text sermon-watch">Watch Now <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
    </div>
  </article>`;
}

function renderSermons() {
  sermonGrid.innerHTML = SERMONS.map((s, i) => sermonCard(s, i)).join('');
}
renderSermons();

const viewAllBtn = document.getElementById('view-all-sermons');
viewAllBtn.addEventListener('click', () => {
  sermonsExpanded = !sermonsExpanded;
  sermonGrid.querySelectorAll('[data-sermon]').forEach((card) => {
    const idx = Number(card.dataset.sermon);
    card.style.display = sermonsExpanded || idx < INITIAL_SERMONS ? '' : 'none';
  });
  viewAllBtn.innerHTML = sermonsExpanded
    ? '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i> Show Fewer'
    : '<i class="fa-solid fa-layer-group" aria-hidden="true"></i> View All Sermons';
});

/* Sermon modal */
const sermonModal = document.getElementById('sermon-modal');
const smVideo = document.getElementById('sm-video');
const smTitle = document.getElementById('sm-title');
const smMeta = document.getElementById('sm-meta');
const smDesc = document.getElementById('sm-desc');
const smNote = document.getElementById('sm-note');
let lastFocused = null;

function openSermon(index) {
  const s = SERMONS[index];
  if (!s) return;
  lastFocused = document.activeElement;
  smTitle.textContent = s.title;
  smMeta.innerHTML = `<i class="fa-solid fa-user" aria-hidden="true"></i> ${s.speaker} &nbsp;·&nbsp; <i class="fa-regular fa-calendar" aria-hidden="true"></i> ${s.date}`;
  smDesc.textContent = s.description;
  if (s.youtubeId) {
    smVideo.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${s.youtubeId}" title="${s.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    smNote.textContent = '';
  } else {
    smVideo.innerHTML = `<div class="modal-video-placeholder"><i class="fa-brands fa-youtube" aria-hidden="true"></i>No video configured for this sermon yet.</div>`;
    smNote.innerHTML = 'To embed a YouTube video, set its <code>youtubeId</code> in the <code>SERMONS</code> list at the top of <code>script.js</code>.';
  }
  sermonModal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('sm-close').focus();
}

function closeSermon() {
  sermonModal.hidden = true;
  smVideo.innerHTML = ''; // stop any playing video
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

sermonGrid.addEventListener('click', (e) => {
  const card = e.target.closest('[data-sermon]');
  if (card && (e.target.closest('.sermon-watch') || e.target.closest('.sermon-play'))) {
    openSermon(Number(card.dataset.sermon));
  }
});
document.getElementById('sm-close').addEventListener('click', closeSermon);
sermonModal.addEventListener('click', (e) => { if (e.target === sermonModal) closeSermon(); });

/* ------------------------------------------------------------------ */
/*  Ministry & event buttons: prefill the contact form                 */
/* ------------------------------------------------------------------ */

function prefillContact(subject) {
  const subjectField = document.getElementById('cf-subject');
  const messageField = document.getElementById('cf-message');
  if (subjectField) subjectField.value = subject;
  if (messageField && !messageField.value) {
    messageField.placeholder = 'Write your message here…';
  }
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => subjectField && subjectField.focus({ preventScroll: true }), 700);
}

document.querySelectorAll('.ministry-more').forEach((btn) => {
  btn.addEventListener('click', () => {
    prefillContact(`I'd like to learn more about the ${btn.dataset.ministry}`);
  });
});
document.querySelectorAll('.event-more').forEach((btn) => {
  btn.addEventListener('click', () => {
    prefillContact(`Registration / question about: ${btn.dataset.event}`);
  });
});

/* ------------------------------------------------------------------ */
/*  Gallery lightbox                                                   */
/* ------------------------------------------------------------------ */

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
let lbIndex = 0;

function openLightbox(index) {
  lbIndex = index;
  lastFocused = document.activeElement;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lb-close').focus();
}

function updateLightbox() {
  const item = galleryItems[lbIndex];
  const img = item.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = item.dataset.caption || img.alt;
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function stepLightbox(dir) {
  lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => stepLightbox(-1));
document.getElementById('lb-next').addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

/* Shared Esc handling for overlays */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!lightbox.hidden) closeLightbox();
    else if (!sermonModal.hidden) closeSermon();
  }
  if (!lightbox.hidden) {
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  }
});

/* ------------------------------------------------------------------ */
/*  Testimonial slider                                                 */
/* ------------------------------------------------------------------ */

const track = document.getElementById('testimonial-track');
const slides = track.children.length;
const dotsWrap = document.getElementById('t-dots');
let tIndex = 0;
let tTimer = null;

for (let i = 0; i < slides; i++) {
  const dot = document.createElement('button');
  dot.className = 't-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', `Testimony ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
}
const dots = Array.from(dotsWrap.children);

function goTo(i) {
  tIndex = (i + slides) % slides;
  track.style.transform = `translateX(-${tIndex * 100}%)`;
  dots.forEach((d, j) => d.classList.toggle('active', j === tIndex));
  restartAuto();
}

function restartAuto() {
  clearInterval(tTimer);
  tTimer = setInterval(() => goTo(tIndex + 1), 7000);
}

document.getElementById('t-prev').addEventListener('click', () => goTo(tIndex - 1));
document.getElementById('t-next').addEventListener('click', () => goTo(tIndex + 1));
const slider = document.getElementById('testimonial-slider');
slider.addEventListener('mouseenter', () => clearInterval(tTimer));
slider.addEventListener('mouseleave', restartAuto);
restartAuto();

// Touch swipe support
let touchX = null;
slider.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
slider.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) goTo(tIndex + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

/* ------------------------------------------------------------------ */
/*  Forms: validation + demo-aware submission                          */
/* ------------------------------------------------------------------ */

function validateField(field) {
  const input = field.querySelector('input, textarea');
  if (!input || !input.required) {
    // Optional email still needs a valid format when filled
    if (input && input.type === 'email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      field.classList.add('invalid');
      field.querySelector('.field-error').textContent = 'Please enter a valid email address.';
      return false;
    }
    field.classList.remove('invalid');
    return true;
  }
  const value = input.value.trim();
  let msg = '';
  if (!value) msg = 'This field is required.';
  else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Please enter a valid email address.';
  else if (input.type === 'tel' && !/^[+()\-.\s\d]{7,20}$/.test(value)) msg = 'Please enter a valid phone number.';
  else if (input.minLength > 0 && value.length < input.minLength) msg = `Please enter at least ${input.minLength} characters.`;

  field.classList.toggle('invalid', !!msg);
  field.querySelector('.field-error').textContent = msg;
  return !msg;
}

function wireForm(formId, statusId, successMsg) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  const fields = Array.from(form.querySelectorAll('.form-field'));

  fields.forEach((f) => {
    const input = f.querySelector('input, textarea');
    input.addEventListener('blur', () => validateField(f));
    input.addEventListener('input', () => {
      if (f.classList.contains('invalid')) validateField(f);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const allValid = fields.map(validateField).every(Boolean);
    status.className = 'form-status';
    if (!allValid) {
      status.textContent = 'Please correct the highlighted fields.';
      status.classList.add('err');
      form.querySelector('.invalid input, .invalid textarea')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.style.opacity = '.65';

    if (!FORM_ENDPOINT) {
      // Demo mode: nothing is sent anywhere.
      status.textContent = successMsg + ' (Demo mode — set FORM_ENDPOINT in script.js to deliver it.)';
      status.classList.add('ok');
      form.reset();
      btn.disabled = false;
      btn.style.opacity = '';
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      status.textContent = successMsg;
      status.classList.add('ok');
      form.reset();
    } catch (err) {
      status.textContent = 'Something went wrong while sending. Please try again or contact the church directly.';
      status.classList.add('err');
    } finally {
      btn.disabled = false;
      btn.style.opacity = '';
    }
  });
}

wireForm('contact-form', 'contact-status', 'Thank you! Your message has been sent.');
wireForm('prayer-form', 'prayer-status', 'Thank you for sharing — our prayer team will stand with you.');

/* ------------------------------------------------------------------ */
/*  Footer year                                                        */
/* ------------------------------------------------------------------ */

document.getElementById('year').textContent = new Date().getFullYear();
