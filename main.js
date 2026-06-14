"use strict";

/* ═══════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════ */
const cursor    = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");

let mx = -200, my = -200;
let cx = -200, cy = -200;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + "px";
  cursorDot.style.top  = my + "px";
});

(function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + "px";
  cursor.style.top  = cy + "px";
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("a, button, .cert-card, .interest-item, .stat-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width  = "56px";
    cursor.style.height = "56px";
    cursor.style.borderColor = "rgba(99,102,241,.5)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width  = "36px";
    cursor.style.height = "36px";
    cursor.style.borderColor = "";
  });
});


/* ═══════════════════════════════
   NAV — SCROLL BEHAVIOUR
═══════════════════════════════ */
const nav = document.getElementById("nav");

const updateNav = () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
};
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();


/* ═══════════════════════════════
   MOBILE MENU
═══════════════════════════════ */
const navToggle  = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

navToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
document.querySelectorAll(".mob-link").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});


/* ═══════════════════════════════
   SMOOTH SCROLL FOR ALL NAV LINKS
═══════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


/* ═══════════════════════════════
   ACTIVE NAV HIGHLIGHT ON SCROLL
═══════════════════════════════ */
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav-link");

const syncActive = () => {
  let current = "";
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle("active", l.dataset.section === current);
  });
};
window.addEventListener("scroll", syncActive, { passive: true });
syncActive();


/* ═══════════════════════════════
   HERO CANVAS — PARTICLE NETWORK
═══════════════════════════════ */
(function heroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  const ctx    = canvas.getContext("2d");
  let W, H, pts;
  const COUNT  = 80;
  const DIST   = 130;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
    }));
  };
  window.addEventListener("resize", resize);
  resize();

  // Mouse repulsion
  let mouseX = W / 2, mouseY = H / 2;
  canvas.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });

  const tick = () => {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 80) {
        p.vx += dx / d * .05;
        p.vy += dy / d * .05;
        // clamp speed
        const speed = Math.sqrt(p.vx ** 2 + p.vy ** 2);
        if (speed > 1.5) { p.vx /= speed; p.vy /= speed; }
      }
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * .35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = .8;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(165,180,252,.55)";
      ctx.fill();
    }

    requestAnimationFrame(tick);
  };
  tick();
})();


/* ═══════════════════════════════
   TYPED ROLE
═══════════════════════════════ */
(function typedRole() {
  const el    = document.getElementById("typedRole");
  const roles = [
    "Site Reliability Engineer",
    "Cloud Engineer",
    "Product Support Engineer",
    "Observability Specialist",
  ];
  let ri = 0, ci = 0, deleting = false;

  const type = () => {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 50 : 90);
  };
  type();
})();


/* ═══════════════════════════════
   STAT COUNTER
═══════════════════════════════ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const end = parseInt(el.dataset.target);
    const sfx = el.dataset.suffix || "+";
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min((now - start) / dur, 1);
      const val = Math.floor(pct * end);
      el.textContent = val + (pct === 1 ? sfx : "");
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: .5 });

document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));


/* ═══════════════════════════════
   SKILL BAR ANIMATION
═══════════════════════════════ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target.querySelector(".skill-fill");
    if (fill) fill.style.width = fill.dataset.w + "%";
    skillObserver.unobserve(entry.target);
  });
}, { threshold: .3 });

document.querySelectorAll(".skill-bar").forEach(el => skillObserver.observe(el));


/* ═══════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(el => {
  revealObserver.observe(el);
});


/* ═══════════════════════════════
   CONTACT FORM (frontend only)
═══════════════════════════════ */
document.getElementById("submitBtn").addEventListener("click", () => {
  const name    = document.getElementById("cName").value.trim();
  const email   = document.getElementById("cEmail").value.trim();
  const subject = document.getElementById("cSubject").value.trim();
  const message = document.getElementById("cMessage").value.trim();
  const status  = document.getElementById("formStatus");

  status.className = "form-status";
  if (!name || !email || !subject || !message) {
    status.className = "form-status error";
    status.textContent = "Please fill in all fields.";
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    status.className = "form-status error";
    status.textContent = "Please enter a valid email address.";
    return;
  }

  // Construct a mailto link as a simple client-side solution
  const mailto = `mailto:niteeshnkp03@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
  window.location.href = mailto;

  status.className = "form-status success";
  status.textContent = "Opening your mail client…";
});
