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