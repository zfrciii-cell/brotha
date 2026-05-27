/* ══ ACCENT PICKER ══ */
const ACCENT_BTNS = document.querySelectorAll('.accent-btn');

function setAccent(color, rgb) {
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-rgb', rgb);
  ACCENT_BTNS.forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-color="${color}"]`).classList.add('active');
}

ACCENT_BTNS.forEach(btn => {
  btn.addEventListener('click', () => {
    setAccent(btn.dataset.color, btn.dataset.rgb);
  });
});

// Default: cyan
setAccent('#00d4ff', '0,212,255');


/* ══ LOADER ══ */
const loader    = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPercent');
const TOTAL = 3000;
let start = null;

function animateLoader(ts) {
  if (!start) start = ts;
  const pct = Math.min(Math.round(((ts - start) / TOTAL) * 100), 100);
  loaderBar.style.width = pct + '%';
  loaderPct.textContent = pct + '%';
  if (ts - start < TOTAL) {
    requestAnimationFrame(animateLoader);
  } else {
    setTimeout(() => { loader.classList.add('hidden'); startTyping(); }, 200);
  }
}
requestAnimationFrame(animateLoader);


/* ══ PARTICLES ══ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function makeParticle() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a: Math.random() * 0.4 + 0.1,
    color: ['#00ff88','#7c3aed','#e040fb'][Math.floor(Math.random()*3)]
  };
}

for (let i = 0; i < 70; i++) particles.push(makeParticle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.a;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ══ CURSOR + TRAIL ══ */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

const TRAIL_COUNT = 14;
const trailEls = [];

for (let i = 0; i < TRAIL_COUNT; i++) {
  const el = document.createElement('div');
  el.className = 'trail-particle';
  const size = 5 - i * 0.25;
  el.style.cssText = `width:${size}px;height:${size}px;opacity:${(1 - i / TRAIL_COUNT) * 0.55};`;
  document.body.appendChild(el);
  trailEls.push({ el, x: 0, y: 0 });
}

let trailPositions = Array(TRAIL_COUNT).fill({ x: 0, y: 0 });

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function loop() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';

  trailPositions = [{ x: mx, y: my }, ...trailPositions.slice(0, TRAIL_COUNT - 1)];
  trailEls.forEach((t, i) => {
    const p = trailPositions[i];
    t.el.style.left = p.x + 'px';
    t.el.style.top  = p.y + 'px';
  });

  requestAnimationFrame(loop);
})();

document.querySelectorAll('a,button,.project-card,.testimonial-card,.skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});


/* ══ NAVBAR SCROLL ══ */
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = pct + '%';
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(link.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ══ HAMBURGER ══ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mob-a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ══ TYPING ══ */
const words  = ['Developer', 'Designer', 'Creator', 'Freelancer'];
const target = document.getElementById('typingText');
let wi = 0, ci = 0, deleting = false;

function type() {
  const word = words[wi];
  if (!deleting) {
    target.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    target.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, deleting ? 55 : 110);
}
function startTyping() { type(); }


/* ══ HERO BUTTONS ══ */
document.getElementById('viewProjectsBtn').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({ behavior:'smooth' });
});
document.getElementById('contactBtn').addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior:'smooth' });
});


/* ══ TOAST ══ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
document.querySelectorAll('.project-card').forEach(c => {
  c.addEventListener('click', () => showToast('Project details coming soon ✦'));
});


/* ══ SCROLL REVEAL + SKILL BARS ══ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }, i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
/* ══ CONTACT FORM ══ */
function handleFormSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  if (!name || !email || !message) return;
  const btn = e.target.querySelector('.form-submit span');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    showToast('Message sent! I\'ll reply soon ✦');
    e.target.reset();
    btn.textContent = 'Send Message';
  }, 1200);
}

/* ══ LANGUAGE SWITCHER ══ */
const TRANSLATIONS = {
  en: {
    nav: ['Home','Skills','Projects','Reviews','Contact'],
    badge: '✦ Available for work',
    hello: "Hello, I'm",
    desc: "I craft modern neon-style websites with buttery-smooth animations, premium UI and unforgettable user experiences.",
    viewProjects: 'View Projects',
    contactMe: 'Contact Me',
    yearsExp: 'Years Exp',
    projects: 'Projects',
    satisfaction: 'Satisfaction',
    soundOn: 'Sound ON',
    soundOff: 'Sound OFF',
  },
  uz: {
    nav: ['Bosh sahifa','Ko\'nikmalar','Loyihalar','Sharhlar','Aloqa'],
    badge: '✦ Ish uchun ochiqman',
    hello: "Salom, men",
    desc: "Men zamonaviy neon uslubidagi saytlar yarataman — silliq animatsiyalar, premium dizayn va unutilmas foydalanuvchi tajribasi.",
    viewProjects: 'Loyihalarni Ko\'rish',
    contactMe: 'Bog\'lanish',
    yearsExp: 'Yil Tajriba',
    projects: 'Loyihalar',
    satisfaction: 'Mamnunlik',
    soundOn: 'Ovoz YOQIQ',
    soundOff: 'Ovoz O\'CHIQ',
  },
  ru: {
    nav: ['Главная','Навыки','Проекты','Отзывы','Контакт'],
    badge: '✦ Открыт к работе',
    hello: "Привет, я",
    desc: "Я создаю современные сайты в неон-стиле с плавными анимациями, премиум-дизайном и незабываемым пользовательским опытом.",
    viewProjects: 'Смотреть Проекты',
    contactMe: 'Связаться',
    yearsExp: 'Лет Опыта',
    projects: 'Проекты',
    satisfaction: 'Удоволетворённость',
    soundOn: 'Звук ВКЛ',
    soundOff: 'Звук ВЫКЛ',
  }
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  // Nav links
  document.querySelectorAll('.nav-links a').forEach((a, i) => { if (t.nav[i]) a.textContent = t.nav[i]; });
  document.querySelectorAll('.mob-a').forEach((a, i) => { if (t.nav[i]) a.textContent = t.nav[i]; });

  // Hero
  const badge = document.querySelector('.badge');
  if (badge) badge.textContent = t.badge;
  const hello = document.querySelector('.hello');
  if (hello) hello.textContent = t.hello;
  const desc = document.querySelector('.desc');
  if (desc) desc.textContent = t.desc;
  const vp = document.querySelector('#viewProjectsBtn span');
  if (vp) vp.textContent = t.viewProjects;
  const cb = document.getElementById('contactBtn');
  if (cb) cb.textContent = t.contactMe;

  // Stats
  const statLabels = document.querySelectorAll('.stat-l');
  if (statLabels[0]) statLabels[0].textContent = t.yearsExp;
  if (statLabels[1]) statLabels[1].textContent = t.projects;
  if (statLabels[2]) statLabels[2].textContent = t.satisfaction;

  // Sound label
  const sl = document.getElementById('soundLabel');
  if (sl) sl.textContent = soundEnabled ? t.soundOn : t.soundOff;

  // Sync all lang buttons
  document.querySelectorAll('.lang-btn, .mob-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-btn, .mob-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    playClick();
    applyLang(btn.dataset.lang);
  });
});


/* ══ SOUND ══ */
let soundEnabled = true;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.08, vol = 0.12) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

function playClick()   { playTone(880, 'sine', 0.07, 0.1); }
function playHover()   { playTone(660, 'sine', 0.05, 0.06); }
function playNav()     { playTone(520, 'triangle', 0.12, 0.09); }
function playOpen()    { playTone(440, 'sine', 0.15, 0.08); playTone(660, 'sine', 0.15, 0.07); }
function playClose()   { playTone(330, 'sine', 0.12, 0.07); }

// Attach hover sounds to interactive elements
document.querySelectorAll('.btn1, .btn2, .project-card, .skill-item, .testimonial-card').forEach(el => {
  el.addEventListener('mouseenter', () => playHover());
});
document.querySelectorAll('.nav-links a, .mob-a').forEach(a => {
  a.addEventListener('click', () => playNav());
});
document.querySelectorAll('.accent-btn').forEach(b => {
  b.addEventListener('click', () => playClick());
});

// Hook hamburger sound
const _hamburger = document.getElementById('hamburger');
_hamburger.addEventListener('click', () => {
  _hamburger.classList.contains('open') ? playOpen() : playClose();
}, true);

// Sound toggle button
const mobSoundBtn = document.getElementById('mobSoundBtn');
const soundIconEl = document.getElementById('soundIcon');
const soundLabelEl = document.getElementById('soundLabel');

const SOUND_ON_SVG  = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>`;
const SOUND_OFF_SVG = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;

mobSoundBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  mobSoundBtn.classList.toggle('muted', !soundEnabled);
  soundIconEl.innerHTML = soundEnabled ? SOUND_ON_SVG : SOUND_OFF_SVG;
  const t = TRANSLATIONS[currentLang];
  soundLabelEl.textContent = soundEnabled ? t.soundOn : t.soundOff;
  if (soundEnabled) playClick();
});

const tiltCard = document.querySelector('.hero-right .card');
if (tiltCard) {
  const heroRight = document.querySelector('.hero-right');
  heroRight.addEventListener('mousemove', e => {
    const rect  = tiltCard.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = -dy * 10;
    const rotY  =  dx * 10;
    tiltCard.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
  });
  heroRight.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  });
}
