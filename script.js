/**
 * LEVRON Global Investments | script.js
 */
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;

/* ── DOM refs ── */
const siteHeader   = $('#siteHeader');
const pageWrap     = $('#pageWrap');
const navMenu      = $('#navMenu');
const menuToggle   = $('#menuToggle');
const contactBtn   = $('#contactBtn');
const cursorEl     = $('#cursor');
const cursorDot    = cursorEl?.querySelector('.cursor-dot');
const cursorRing   = cursorEl?.querySelector('.cursor-ring');

/* ── State ── */
let menuOpen = false;
let mx = -200, my = -200;
let cx = -200, cy = -200;
let rx = -200, ry = -200;

/* ══════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════ */
function initCursor() {
  if (!cursorEl) return;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .p-row, .cta-btn, .cta-btn-gold'))
      document.body.classList.add('c-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .p-row, .cta-btn, .cta-btn-gold'))
      document.body.classList.remove('c-hover');
  });

  (function tick() {
    cx = lerp(cx, mx, 0.12); cy = lerp(cy, my, 0.12);
    cursorEl.style.left = cx + 'px';
    cursorEl.style.top = cy + 'px';
    requestAnimationFrame(tick);
  })();
}

/* ══════════════════════════════════════════════
   HERO CANVAS BACKGROUND (Flowing Geometric Waves & Connected Lines)
══════════════════════════════════════════════ */
function initHeroBackground() {
  const canvas = document.getElementById('hero-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const dpr = window.devicePixelRatio || 1;
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  
  let isVisible = true;
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }

  // Currency definitions with worth values (USD exchange rates) as shown in reference
  const currencyData = [
    { text: 'د.ك', label: 'KWD', worth: 3.25 }, // Kuwaiti Dinar
    { text: 'د.ب', label: 'BHD', worth: 2.65 }, // Bahraini Dinar
    { text: 'ر.ع.', label: 'OMR', worth: 2.60 }, // Omani Rial
    { text: 'د.ج', label: 'JOD', worth: 1.41 }, // Jordanian Dinar
    { text: '£', label: 'GBP', worth: 1.35 },    // British Pound Sterling
    { text: '£', label: 'GIP', worth: 1.35 },    // Gibraltar Pound
    { text: 'CI$', label: 'KYD', worth: 1.20 },  // Cayman Islands Dollar
    { text: 'Fr', label: 'CHF', worth: 1.25 },   // Swiss Franc
    { text: '€', label: 'EUR', worth: 1.18 },    // Euro
    { text: '$', label: 'USD', worth: 1.00 },     // United States Dollar
    { text: 'S$', label: 'SGD', worth: 0.74 },   // Singapore Dollar
    { text: 'C$', label: 'CAD', worth: 0.73 },   // Canadian Dollar
    { text: 'A$', label: 'AUD', worth: 0.66 },   // Australian Dollar
    { text: 'د.إ', label: 'AED', worth: 0.27 },  // UAE Dirham
    { text: 'ر.س', label: 'SAR', worth: 0.27 },  // Saudi Riyal
    { text: 'ر.ق', label: 'QAR', worth: 0.27 },  // Qatari Riyal
    { text: '元', label: 'CNY', worth: 0.14 },   // Chinese Yuan
    { text: '₹', label: 'INR', worth: 0.012 },  // Indian Rupee
    { text: '円', label: 'JPY', worth: 0.006 },  // Japanese Yen
    { text: 'NZ$', label: 'NZD', worth: 0.61 },  // New Zealand Dollar
    { text: 'HK$', label: 'HKD', worth: 0.13 },  // Hong Kong Dollar
    { text: 'kr', label: 'SEK', worth: 0.095 },  // Swedish Krona
    { text: 'kr', label: 'NOK', worth: 0.094 },  // Norwegian Krone
    { text: 'kr', label: 'DKK', worth: 0.14 },   // Danish Krone
    { text: 'zł', label: 'PLN', worth: 0.25 },   // Polish Zloty
    { text: '₺', label: 'TRY', worth: 0.031 },  // Turkish Lira
    { text: 'R$', label: 'BRL', worth: 0.18 },   // Brazilian Real
    { text: 'R', label: 'ZAR', worth: 0.055 },   // South African Rand
    { text: '₩', label: 'KRW', worth: 0.00072 }, // South Korean Won
    { text: 'Mex$', label: 'MXN', worth: 0.056 }, // Mexican Peso
    { text: '₪', label: 'ILS', worth: 0.27 },    // Israeli Shekel
    { text: 'RM', label: 'MYR', worth: 0.21 },   // Malaysian Ringgit
    { text: '฿', label: 'THB', worth: 0.027 },   // Thai Baht
    { text: 'Rp', label: 'IDR', worth: 0.00006 }, // Indonesian Rupiah
    { text: '₱', label: 'PHP', worth: 0.017 },   // Philippine Peso
    { text: '₫', label: 'VND', worth: 0.000039 }, // Vietnamese Dong
    { text: 'E£', label: 'EGP', worth: 0.021 },  // Egyptian Pound
    { text: '₦', label: 'NGN', worth: 0.00067 }, // Nigerian Naira
    { text: '₽', label: 'RUB', worth: 0.011 },   // Russian Ruble
    { text: 'AR$', label: 'ARS', worth: 0.0011 }, // Argentine Peso
    { text: 'CLP$', label: 'CLP', worth: 0.0011 } // Chilean Peso
  ];

  // Initialize symbols with floating positions and slow space-like velocities
  let symbols = [];
  
  function initSymbols() {
    const sizeFactor = Math.min(1, width / 1200);
    
    symbols = currencyData.map(data => {
      // Sizing formula adapted to accommodate 41 symbols without overcrowding:
      // High worth dinars/rials scale exponentially up to max ~88px radius (176px diameter).
      // Lower worth currencies scale down to min 16px radius (32px diameter).
      let baseRadius;
      if (data.worth >= 1.0) {
        baseRadius = 26 + Math.pow(data.worth - 1.0, 1.6) * 22;
      } else {
        baseRadius = 15 + data.worth * 11;
      }
      
      // Scaled up by 20%
      const finalRadius = Math.max(12, baseRadius * sizeFactor) * 1.20;
      
      let x, y, overlaps;
      let attempts = 0;
      
      do {
        overlaps = false;
        x = Math.random() * (width - finalRadius * 2) + finalRadius;
        y = Math.random() * (height - finalRadius * 2) + finalRadius;
        
        if (isNaN(x) || x < finalRadius || x > width - finalRadius) {
          x = width / 2 + (Math.random() - 0.5) * 100;
        }
        if (isNaN(y) || y < finalRadius || y > height - finalRadius) {
          y = height / 2 + (Math.random() - 0.5) * 100;
        }
        
        for (const other of symbols) {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < finalRadius + other.radius + 8) {
            overlaps = true;
            break;
          }
        }
        attempts++;
      } while (overlaps && attempts < 200);

      return {
        text: data.text,
        label: data.label,
        worth: data.worth,
        radius: finalRadius,
        mass: finalRadius * finalRadius, 
        x: x,
        y: y,
        // Extremely slow space drifting speeds (reduced from 0.35 max to 0.1 max)
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1
      };
    });
  }

  function resize() {
    const prevW = width;
    const prevH = height;
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    
    const sizeFactor = Math.min(1, width / 1200);
    
    symbols.forEach((s, idx) => {
      const origData = currencyData[idx];
      let baseRadius;
      if (origData.worth >= 1.0) {
        baseRadius = 26 + Math.pow(origData.worth - 1.0, 1.6) * 22;
      } else {
        baseRadius = 15 + origData.worth * 11;
      }
      // Scaled up by 20%
      s.radius = Math.max(12, baseRadius * sizeFactor) * 1.20;
      s.mass = s.radius * s.radius;
      
      s.x = (s.x / prevW) * width;
      s.y = (s.y / prevH) * height;
      
      s.x = Math.max(s.radius, Math.min(width - s.radius, s.x));
      s.y = Math.max(s.radius, Math.min(height - s.radius, s.y));
    });
  }
  
  initSymbols();
  window.addEventListener('resize', resize, { passive: true });

  function resolveCollisions() {
    for (let i = 0; i < symbols.length; i++) {
      const s1 = symbols[i];
      
      for (let j = i + 1; j < symbols.length; j++) {
        const s2 = symbols[j];
        
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = s1.radius + s2.radius;
        
        if (dist < minDist) {
          const nx = dx / dist; 
          const ny = dy / dist; 
          
          const tx = -ny; 
          const ty = nx;  
          
          const v1n = s1.vx * nx + s1.vy * ny;
          const v1t = s1.vx * tx + s1.vy * ty;
          const v2n = s2.vx * nx + s2.vy * ny;
          const v2t = s2.vx * tx + s2.vy * ty;
          
          // Only resolve bounce if they are moving towards each other
          const relativeVel = v2n - v1n;
          if (relativeVel < 0) {
            const v1n_new = (v1n * (s1.mass - s2.mass) + 2 * s2.mass * v2n) / (s1.mass + s2.mass);
            const v2n_new = (v2n * (s2.mass - s1.mass) + 2 * s1.mass * v1n) / (s1.mass + s2.mass);
            
            s1.vx = v1n_new * nx + v1t * tx;
            s1.vy = v1n_new * ny + v1t * ty;
            s2.vx = v2n_new * nx + v2t * tx;
            s2.vy = v2n_new * ny + v2t * ty;
          }
          
          // Small overlap correction to prevent sticking
          const overlap = minDist - dist;
          s1.x -= overlap * nx * 0.5;
          s1.y -= overlap * ny * 0.5;
          s2.x += overlap * nx * 0.5;
          s2.y += overlap * ny * 0.5;
        }
      }
      
      // Wall collisions
      if (s1.x - s1.radius < 0) {
        s1.vx = Math.abs(s1.vx);
        s1.x = s1.radius;
      } else if (s1.x + s1.radius > width) {
        s1.vx = -Math.abs(s1.vx);
        s1.x = width - s1.radius;
      }
      
      if (s1.y - s1.radius < 0) {
        s1.vy = Math.abs(s1.vy);
        s1.y = s1.radius;
      } else if (s1.y + s1.radius > height) {
        s1.vy = -Math.abs(s1.vy);
        s1.y = height - s1.radius;
      }
    }
  }

  function animate() {
    if (!isVisible) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Update positions and handle hover push
    symbols.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      
      if (mx > 0 && my > 0 && my < height) {
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < s.radius + 80) {
          const force = (1 - dist / (s.radius + 80)) * 0.05;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
          
          // Cap pushed velocity
          const speed = Math.sqrt(s.vx*s.vx + s.vy*s.vy);
          if (speed > 0.35) {
            s.vx = (s.vx / speed) * 0.35;
            s.vy = (s.vy / speed) * 0.35;
          }
        }
      }
      
      // Gently decay speed back to the base slow drifting range after pushing
      const speed = Math.sqrt(s.vx*s.vx + s.vy*s.vy);
      if (speed > 0.08) {
        s.vx *= 0.985;
        s.vy *= 0.985;
      }
    });

    resolveCollisions();

    // Render symbols
    symbols.forEach(s => {
      // Glow background centered behind the text
      const glow = ctx.createRadialGradient(s.x, s.y, s.radius * 0.1, s.x, s.y, s.radius);
      glow.addColorStop(0, 'rgba(116, 20, 12, 0.08)');
      glow.addColorStop(0.6, 'rgba(116, 20, 12, 0.02)');
      glow.addColorStop(1, 'rgba(238, 237, 233, 0)');
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Large Floating Currency Symbol text (watermark style, Ink Navy)
      ctx.font = `300 ${s.radius * 0.95}px 'Cinzel', serif`;
      ctx.fillStyle = 'rgba(16, 28, 54, 0.14)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(116, 20, 12, 0.06)';
      ctx.shadowBlur = 8;
      ctx.fillText(s.text, s.x, s.y);
      ctx.shadowBlur = 0; 
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ══════════════════════════════════════════════
   HERO ENTRANCE
══════════════════════════════════════════════ */
function revealHero() {
  $$('.js-anim').forEach(el => el.classList.add('show'));
}

/* ══════════════════════════════════════════════
   MENU
══════════════════════════════════════════════ */
function initMenu() {
  menuToggle?.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

  /* Smooth scroll on nav links */
  $$('[data-close-menu]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        setTimeout(() => $(href)?.scrollIntoView({ behavior: 'smooth' }), 420);
      }
    });
  });

  contactBtn?.addEventListener('click', () =>
    $('#contact')?.scrollIntoView({ behavior: 'smooth' })
  );

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

function openMenu() {
  menuOpen = true;
  navMenu.classList.add('open');
  navMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}

function closeMenu() {
  menuOpen = false;
  navMenu.classList.remove('open');
  navMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });

  $$('.js-reveal').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   NAV HIGHLIGHT
══════════════════════════════════════════════ */
function initNavHighlight() {
  const links = $$('.nav-link');
  const ids   = ['hero', 'who-we-are', 'approach', 'about', 'platforms', 'governance', 'leadership'];

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = ids.indexOf(entry.target.id);
      if (idx < 0) return;
      links.forEach((l, i) => l.classList.toggle('is-active', i === idx));
    });
  }, { threshold: 0.25 });

  ids.forEach(id => { const el = $('#' + id); if (el) io.observe(el); });
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeroBackground();
  initMenu();
  initScrollReveal();
  initNavHighlight();

  // Prevent scroll during splash screen
  document.body.style.overflow = 'hidden';

  // Handle splash screen and FLIP logo transition
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    const splashLogo = document.getElementById('splashLogo');
    const heroLogo = document.getElementById('heroLogo');
    const tagline = splash?.querySelector('.levron-tagline');

    if (splash && splashLogo && heroLogo) {
      // Make sure page is at top before measuring
      window.scrollTo(0, 0);

      // 1. Get First position
      const r1 = splashLogo.getBoundingClientRect();

      // Temporarily ensure heroLogo layout exists for measurement
      heroLogo.style.visibility = 'visible';
      heroLogo.style.opacity = '0';

      // 2. Get Last position
      const r2 = heroLogo.getBoundingClientRect();

      // 3. Calculate transition values
      const dx = r2.left + r2.width/2 - (r1.left + r1.width/2);
      const dy = r2.top + r2.height/2 - (r1.top + r1.height/2);
      const scale = r2.width / r1.width;

      // 4. Animate splash logo
      splashLogo.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.35, 1)';
      splashLogo.style.transformOrigin = 'center center';
      splashLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

      if (tagline) {
        tagline.style.transition = 'opacity 0.6s ease';
        tagline.style.opacity = '0';
      }

      // Smoothly fade out splash screen background
      splash.style.transition = 'background-color 1.2s ease';
      splash.style.backgroundColor = 'transparent';
      splash.style.pointerEvents = 'none';

      // Reveal hero section texts (staggered)
      revealHero();

      // Finish transition and swap to static hero logo
      setTimeout(() => {
        heroLogo.style.opacity = '1';
        splash.style.display = 'none';
        document.body.style.overflow = '';
      }, 1200);

    } else {
      revealHero();
      document.body.style.overflow = '';
    }
  }, 1500);
});

/* ══════════════════════════════════════════════
   FLOWER BACKGROUND VIDEO & PARTICLES (Restructured for section-specific trigger)
══════════════════════════════════════════════ */
(function() {
  const isMobile = window.innerWidth < 768;

  // ===================== SCROLL VIDEO =====================
  const VIDEO_URL = 'flower.mp4';
  const canvas = document.getElementById('video-canvas');
  const videoEl = document.getElementById('video-fallback');
  const ctx = canvas.getContext('2d', { alpha: false });
  let frames = [];
  let framesReady = false;
  let lastFrameIndex = -1;
  let lastSeekTime = 0;
  let lastScrollY = -1;

  const magicSection = document.getElementById('magicScrollSection');
  const scrollVideoContainer = document.getElementById('scroll-video-container');
  const particlesCanvas = document.getElementById('particles-canvas');

  function resizeCanvas() {
    const dpr = isMobile ? 1 : Math.min(devicePixelRatio, 2.0);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      lastFrameIndex = -1;
    }
  }

  async function extractFrames() {
    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      video.preload = 'auto';
      video.src = VIDEO_URL;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = (e) => reject(e);
        setTimeout(() => reject(new Error("Timeout loading video metadata")), 15000);
      });

      const maxW = isMobile ? 720 : 1920;
      const scale = Math.min(1, maxW / video.videoWidth);
      const scaledWidth = Math.round(video.videoWidth * scale);
      const scaledHeight = Math.round(video.videoHeight * scale);

      const frameCount = Math.min(40, Math.round(video.duration * 12));

      for (let i = 0; i < frameCount; i++) {
        const time = (i / (frameCount - 1)) * (video.duration - 0.05);
        video.currentTime = time;
        await new Promise((resolve, reject) => {
          const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
          video.addEventListener('seeked', onSeeked);
          video.onerror = (e) => { video.removeEventListener('seeked', onSeeked); reject(e); };
          setTimeout(() => { video.removeEventListener('seeked', onSeeked); reject(new Error("Timeout seek")); }, 3000);
        });
        const bitmap = await createImageBitmap(video);
        frames.push(bitmap);

        if (i === 0) {
          canvas.style.visibility = 'visible';
          videoEl.style.display = 'none';
          drawFrame(bitmap);
        }
      }

      framesReady = true;
    } catch(e) {
      console.warn("Direct video scrubbing fallback active:", e.message || e);
      canvas.style.display = 'none';
      videoEl.style.display = 'block';
      videoEl.style.visibility = 'visible';
    }
  }

  function drawFrame(frame) {
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / frame.width, ch / frame.height);
    const dw = frame.width * s, dh = frame.height * s;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  // Repaint the last known frame — called after tab switch to restore discarded canvas buffer
  function redrawCurrentFrame() {
    if (framesReady && frames.length > 0 && lastFrameIndex >= 0 && frames[lastFrameIndex]) {
      resizeCanvas();
      drawFrame(frames[lastFrameIndex]);
    }
  }

  // ── Adaptive text overlay sequencer ──
  const flowerTexts = [
    document.getElementById('flowerText1'),
    document.getElementById('flowerText2'),
    document.getElementById('flowerText3')
  ];

  // Scroll velocity tracking
  let velocitySamples = [];
  let lastVelocityScroll = 0;
  let lastVelocityTime = 0;

  function measureScrollVelocity() {
    const now = performance.now();
    const sy = window.scrollY;
    if (lastVelocityTime > 0) {
      const dt = now - lastVelocityTime;
      if (dt > 0) {
        const speed = Math.abs(sy - lastVelocityScroll) / dt; // px/ms
        velocitySamples.push(speed);
        if (velocitySamples.length > 8) velocitySamples.shift();
      }
    }
    lastVelocityScroll = sy;
    lastVelocityTime = now;
  }

  function getAvgVelocity() {
    if (velocitySamples.length === 0) return 0.5;
    return velocitySamples.reduce((a, b) => a + b, 0) / velocitySamples.length;
  }

  function updateSequencer(progress, inFlower) {
    const DEBUG_MODE = true; // Set to false to return to normal scroll-based fading

    if (!inFlower && !DEBUG_MODE) {
      flowerTexts.forEach(el => { if (el) el.classList.remove('visible'); });
      return;
    }

    // Text 1: fades in at 0.10, disappears at 0.30 (gap until 0.37)
    const show1 = DEBUG_MODE || (progress >= 0.10 && progress <= 0.30);
    // Text 2: fades in at 0.37, disappears at 0.53 (gap until 0.60)
    const show2 = DEBUG_MODE || (progress >= 0.37 && progress <= 0.53);
    // Text 3: fades in at 0.60, disappears at 0.80
    const show3 = DEBUG_MODE || (progress >= 0.60 && progress <= 0.80);

    const showStates = [show1, show2, show3];

    flowerTexts.forEach((el, idx) => {
      if (el) {
        if (showStates[idx]) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      }
    });
  }

  function videoTick() {
    const sy = window.scrollY;
    measureScrollVelocity();

    let inFlower = false;
    let progress = 0;

    if (sy !== lastScrollY) {
      lastScrollY = sy;
      
      const vh = window.innerHeight;
      let canvasOpacity = 0;
      progress = 0;

      if (magicSection) {
        const rect = magicSection.getBoundingClientRect();
        
        // 1. Calculate canvas background opacity
        if (rect.top > vh) {
          canvasOpacity = 0;
        } else if (rect.top > 0) {
          canvasOpacity = 1 - (rect.top / vh);
        } else if (rect.bottom < 0) {
          canvasOpacity = 0;
        } else if (rect.bottom < vh) {
          canvasOpacity = rect.bottom / vh;
        } else {
          canvasOpacity = 1;
        }

        // 2. Calculate scroll progress inside sticky range
        const totalScrollable = rect.height - vh;
        if (totalScrollable > 0) {
          progress = -rect.top / totalScrollable;
          progress = Math.max(0, Math.min(1, progress));
        }

        // Update background elements
        if (scrollVideoContainer) {
          scrollVideoContainer.style.opacity = canvasOpacity;
          scrollVideoContainer.style.visibility = canvasOpacity > 0.01 ? 'visible' : 'hidden';
        }
        if (particlesCanvas) {
          particlesCanvas.style.opacity = canvasOpacity;
          particlesCanvas.style.visibility = canvasOpacity > 0.01 ? 'visible' : 'hidden';
        }

        // 3. Scrub video frames or fall back to throttled direct seeking
        const isSticky = rect.top <= 50 && rect.bottom >= vh - 50;
        if (isSticky) {
          if (framesReady && frames.length > 0) {
            const idx = Math.round(progress * (frames.length - 1));
            if (idx !== lastFrameIndex) {
              lastFrameIndex = idx;
              if (frames[idx]) drawFrame(frames[idx]);
            }
          } else if (videoEl.duration && isFinite(videoEl.duration) && videoEl.readyState >= 1) {
            const target = progress * videoEl.duration;
            const now = performance.now();
            if (now - lastSeekTime > 50 && Math.abs(videoEl.currentTime - target) > 0.04) {
              lastSeekTime = now;
              videoEl.currentTime = target;
            }
          }
        }

        // Calculate if we are in the flower section
        inFlower = rect.top <= 100 && rect.bottom >= vh - 100;

      } else {
        // Fallback calculation when there is no magicSection
        const end = document.documentElement.scrollHeight - vh;
        progress = end > 0 ? Math.max(0, Math.min(1, sy / end)) : 0;
        canvasOpacity = 1;
        if (scrollVideoContainer) {
          scrollVideoContainer.style.opacity = 1;
          scrollVideoContainer.style.visibility = 'visible';
        }
      }
    } else {
      // If not scrolling, still determine if we are currently within the flower section bounds
      if (magicSection) {
        const rect = magicSection.getBoundingClientRect();
        const vh = window.innerHeight;
        inFlower = rect.top <= 100 && rect.bottom >= vh - 100;

        const totalScrollable = rect.height - vh;
        if (totalScrollable > 0) {
          progress = -rect.top / totalScrollable;
          progress = Math.max(0, Math.min(1, progress));
        }
      }
    }

    // Update the dynamic text overlay sequencer on every frame
    updateSequencer(progress, inFlower);

    requestAnimationFrame(videoTick);
  }

  // Force a redraw and wake up HTML5 video decoder after browser tab suspension
  function wakeUpDecoder() {
    // Bug 1 fix: repaint extracted frames (browser may have discarded canvas pixel buffer)
    redrawCurrentFrame();
    lastScrollY = -1; // force the tick loop to re-evaluate everything

    // If using direct video fallback, kick the decoder awake
    if (videoEl && !framesReady) {
      videoEl.play().then(() => {
        videoEl.pause();
      }).catch(() => {});
    }
  }

  window.addEventListener('focus', wakeUpDecoder);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      wakeUpDecoder();
    }
  });

  videoEl.addEventListener('loadeddata', () => { videoEl.currentTime = 0; });
  canvas.style.visibility = 'hidden';

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  requestAnimationFrame(videoTick);
  extractFrames();

  // ===================== PARTICLES =====================
  const pCanvas = document.getElementById('particles-canvas');
  const pCtx = pCanvas.getContext('2d', { alpha: true });
  let particles = [];
  let pRaf;

  let pLayoutWidth = window.innerWidth;
  let pLayoutHeight = window.innerHeight;

  function resizeParticles() {
    const dpr = isMobile ? 1 : Math.min(devicePixelRatio, 2.0);
    pLayoutWidth = window.innerWidth;
    pLayoutHeight = window.innerHeight;
    pCanvas.width = pLayoutWidth * dpr;
    pCanvas.height = pLayoutHeight * dpr;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const divisor = isMobile ? 25000 : 18000;
    const count = Math.floor((pLayoutWidth * pLayoutHeight) / divisor);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * pLayoutWidth,
        y: Math.random() * pLayoutHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
  }

  function animateParticles() {
    const dpr = isMobile ? 1 : Math.min(devicePixelRatio, 2.0);
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = pLayoutWidth;
      if (p.x > pLayoutWidth) p.x = 0;
      if (p.y < 0) p.y = pLayoutHeight;
      if (p.y > pLayoutHeight) p.y = 0;
      pCtx.beginPath();
      pCtx.arc(p.x * dpr, p.y * dpr, p.size * dpr, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      pCtx.fill();
    }
    pRaf = requestAnimationFrame(animateParticles);
  }

  resizeParticles();
  window.addEventListener('resize', resizeParticles, { passive: true });
  animateParticles();
})();
