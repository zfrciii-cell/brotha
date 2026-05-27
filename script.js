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
    r: Math.random() * 2.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    a: Math.random() * 0.5 + 0.08,
    color: ['#00ff88','#7c3aed','#e040fb','#00d4ff','#ffd60a','#ff6b35'][Math.floor(Math.random()*6)]
  };
}

for (let i = 0; i < 130; i++) particles.push(makeParticle());

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
let words  = ['Developer', 'Designer', 'Creator', 'Freelancer'];
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

/* ══ I18N ══ */
const TRANSLATIONS = {
  en: {
    nav_home: 'Home', nav_skills: 'Skills', nav_projects: 'Projects',
    nav_reviews: 'Reviews', nav_contact: 'Contact',
    badge: '✦ Available for work', hello: "Hello, I'm",
    i_am: "I'm a ",
    desc: 'I craft modern neon-style websites with buttery-smooth animations, premium UI and unforgettable user experiences.',
    btn_projects: 'View Projects', btn_contact: 'Contact Me',
    stat_exp: 'Years Exp', stat_projects: 'Projects', stat_satisfaction: 'Satisfaction',
    skills_title: 'Skills', projects_title: 'Projects',
    reviews_title: 'Say', contact_title: 'Work Together',
    contact_lead: "Have a project in mind? Drop me a message — I reply within 24 hours.",
    typing_words: ['Developer', 'Designer', 'Creator', 'Freelancer']
  },
  uz: {
    nav_home: 'Asosiy', nav_skills: 'Ko\'nikmalar', nav_projects: 'Loyihalar',
    nav_reviews: 'Sharhlar', nav_contact: 'Aloqa',
    badge: '✦ Ish uchun tayyor', hello: "Salom, men",
    i_am: "Men — ",
    desc: 'Zamonaviy neon uslubidagi saytlar yarataman: silliq animatsiyalar, premium UI va unutilmas foydalanuvchi tajribasi.',
    btn_projects: 'Loyihalar', btn_contact: 'Bog\'lanish',
    stat_exp: 'Yil Tajriba', stat_projects: 'Loyiha', stat_satisfaction: 'Muvaffaqiyat',
    skills_title: 'Ko\'nikmalar', projects_title: 'Loyihalar',
    reviews_title: 'Fikrlar', contact_title: 'Hamkorlik',
    contact_lead: "Loyihangiz bormi? Xabar yuboring — 24 soat ichida javob beraman.",
    typing_words: ['Dasturchi', 'Dizayner', 'Ijodkor', 'Frilanser']
  },
  ru: {
    nav_home: 'Главная', nav_skills: 'Навыки', nav_projects: 'Проекты',
    nav_reviews: 'Отзывы', nav_contact: 'Контакт',
    badge: '✦ Открыт для работы', hello: "Привет, я",
    i_am: "Я — ",
    desc: 'Создаю современные сайты в неон-стиле: плавные анимации, премиальный UI и незабываемый пользовательский опыт.',
    btn_projects: 'Проекты', btn_contact: 'Написать',
    stat_exp: 'Лет опыта', stat_projects: 'Проектов', stat_satisfaction: 'Успех',
    skills_title: 'Навыки', projects_title: 'Проекты',
    reviews_title: 'Говорят', contact_title: 'Сотрудничество',
    contact_lead: "Есть проект? Напишите мне — отвечу в течение 24 часов.",
    typing_words: ['Разработчик', 'Дизайнер', 'Создатель', 'Фрилансер']
  }
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  // Update typing words
  words.length = 0;
  t.typing_words.forEach(w => words.push(w));
  // Reset typing
  wi = 0; ci = 0; deleting = false;
  if (target) target.textContent = '';
  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});


/* ══ AMBIENT SOUND ══ */
const soundBtn = document.getElementById('soundToggle');
const mobSoundBtn = document.getElementById('mobSoundToggle');

function getSoundIcons(btn) {
  return {
    off: btn.querySelector('.sound-off'),
    on:  btn.querySelector('.sound-on')
  };
}

function setSoundUI(playing) {
  [soundBtn, mobSoundBtn].forEach(btn => {
    if (!btn) return;
    const { off, on } = getSoundIcons(btn);
    btn.classList.toggle('playing', playing);
    off.style.display = playing ? 'none'  : 'block';
    on.style.display  = playing ? 'block' : 'none';
  });
}

const soundOffIcon = soundBtn.querySelector('.sound-off');
const soundOnIcon  = soundBtn.querySelector('.sound-on');
let audioCtx = null;
let soundPlaying = false;
let masterGain = null;
let melodyTimeout = null;
let padNodes = [];

function createReverb(ctx) {
  const convolver = ctx.createConvolver();
  const length = ctx.sampleRate * 3;
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const ch = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

// Pentatonic scale: C4, D4, E4, G4, A4, C5, D5, E5
const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

function playMelodyNote(ctx, reverb, gain, delay) {
  const freq = NOTES[Math.floor(Math.random() * NOTES.length)];
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;

  const t = ctx.currentTime + delay;
  oscGain.gain.setValueAtTime(0, t);
  oscGain.gain.linearRampToValueAtTime(0.18, t + 0.04);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

  osc.connect(oscGain);
  oscGain.connect(reverb);
  oscGain.connect(gain); // dry signal too
  osc.start(t);
  osc.stop(t + 2.4);
}

function scheduleMelody(ctx, reverb, gain) {
  const notesInPhrase = 3 + Math.floor(Math.random() * 3);
  let offset = 0;
  for (let i = 0; i < notesInPhrase; i++) {
    playMelodyNote(ctx, reverb, gain, offset);
    offset += 0.35 + Math.random() * 0.55;
  }
  const nextPhrase = (offset + 1.5 + Math.random() * 2) * 1000;
  melodyTimeout = setTimeout(() => scheduleMelody(ctx, reverb, gain), nextPhrase);
}

function createAmbient() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 2.5);
  masterGain.connect(audioCtx.destination);

  const reverb = createReverb(audioCtx);
  const reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.38;
  reverb.connect(reverbGain);
  reverbGain.connect(masterGain);

  // Soft pad: 3 sine oscillators tuned to C major chord
  const padFreqs = [130.81, 164.81, 196.00]; // C3 E3 G3
  padFreqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    // subtle vibrato
    const lfo = audioCtx.createOscillator();
    const lfoG = audioCtx.createGain();
    lfo.frequency.value = 0.2 + i * 0.07;
    lfoG.gain.value = freq * 0.003;
    lfo.connect(lfoG); lfoG.connect(osc.frequency);
    lfo.start();
    g.gain.value = 0.07 - i * 0.015;
    osc.connect(g);
    g.connect(reverb);
    g.connect(masterGain);
    osc.start();
    padNodes.push(osc, lfo);
  });

  scheduleMelody(audioCtx, reverb, masterGain);
}

function toggleSound() {
  if (!soundPlaying) {
    if (!audioCtx) {
      createAmbient();
    } else {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 1.5);
      scheduleMelody(audioCtx, { connect: () => {} }, masterGain);
    }
    soundPlaying = true;
    setSoundUI(true);
  } else {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    clearTimeout(melodyTimeout);
    setTimeout(() => audioCtx.suspend(), 1600);
    soundPlaying = false;
    setSoundUI(false);
  }
}

soundBtn.addEventListener('click', toggleSound);
if (mobSoundBtn) mobSoundBtn.addEventListener('click', toggleSound);
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
