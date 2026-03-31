/* =============================================
   OBAID PORTFOLIO — script.js
   Particles · Typing · Scroll · Interactions
============================================= */

"use strict";

// ===================== CURSOR =====================
const cursor = document.getElementById("cursor");
const trail = document.getElementById("cursorTrail");
let mx = 0,
  my = 0,
  tx = 0,
  ty = 0;

if (cursor && trail) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  function animTrail() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    trail.style.left = tx + "px";
    trail.style.top = ty + "px";
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document
    .querySelectorAll(
      "a, button, .skill-card, .project-card, .mindset-card, .contact-link",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        trail.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        trail.classList.remove("hover");
      });
    });
}

// ===================== NAVBAR =====================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ===================== CANVAS — PARTICLES =====================
const canvas = document.getElementById("heroCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let W,
  H,
  particles,
  mouse = { x: -1000, y: -1000 };

function resize() {
  if (!canvas) return;
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color =
      Math.random() > 0.85
        ? "#00ffab"
        : Math.random() > 0.7
          ? "#ffd700"
          : "#ffffff";
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = ((120 - dist) / 120) * 0.5;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
  }
}

function initParticles() {
  if (!ctx) return;
  resize();
  const count = Math.min(Math.floor((W * H) / 7000), 140);
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,171,${0.07 * (1 - d / 100)})`;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  drawConnections();
  ctx.globalAlpha = 1;
  requestAnimationFrame(animParticles);
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("resize", initParticles);

initParticles();
animParticles();

// ===================== TYPING EFFECT =====================
const roles = [
  "Backend Engineer",
  "Entrepreneur",
  "Systems Builder",
  "Self-Taught Dev",
  "Future Millionaire",
];

let roleIdx = 0,
  charIdx = 0,
  deleting = false;
const typedEl = document.getElementById("typedText");

function typeRole() {
  if (!typedEl) return;
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 55 : 95);
}
setTimeout(typeRole, 1200);

// ===================== SCROLL ANIMATIONS =====================
function onVisible(el, cb, threshold = 0.15) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cb(el);
          obs.unobserve(el);
        }
      });
    },
    { threshold },
  );
  obs.observe(el);
}

// Progress bars in About
document.querySelectorAll(".progress-fill").forEach((bar) => {
  onVisible(bar, (el) => {
    el.style.width = el
      .closest(".progress-item")
      .querySelector(".progress-pct").textContent;
  });
});

// Skill bars
document.querySelectorAll(".skill-card").forEach((card) => {
  onVisible(card, (el) => el.classList.add("in-view"), 0.1);
});

// Devlog entries
document.querySelectorAll(".devlog-entry").forEach((entry, i) => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => entry.classList.add("visible"), i * 120);
          obs.unobserve(entry);
        }
      });
    },
    { threshold: 0.1 },
  );
  obs.observe(entry);
});

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ===================== PROJECT CARD TILT =====================
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===================== SKILL CARD GLOW TRACKING =====================
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.querySelector(".skill-card-glow").style.cssText =
      `opacity:1; left:${x}px; top:${y}px; transform:translate(-50%,-50%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.querySelector(".skill-card-glow").style.opacity = "0";
  });
});

// ===================== CONTACT FORM =====================
const sendBtn = document.getElementById("sendBtn");
const formNote = document.getElementById("formNote");

sendBtn?.addEventListener("click", () => {
  const name = document.getElementById("formName")?.value.trim();
  const email = document.getElementById("formEmail")?.value.trim();
  const msg = document.getElementById("formMsg")?.value.trim();

  if (!name || !email || !msg) {
    formNote.textContent = "⚠ Please fill all fields.";
    formNote.style.color = "#ff6b6b";
    return;
  }
  sendBtn.disabled = true;
  sendBtn.querySelector("span").textContent = "Sending...";
  setTimeout(() => {
    formNote.textContent = "✓ Message received. I'll get back to you soon.";
    formNote.style.color = "#00ffab";
    sendBtn.querySelector("span").textContent = "Send Message";
    sendBtn.disabled = false;
    document.getElementById("formName").value = "";
    document.getElementById("formEmail").value = "";
    document.getElementById("formMsg").value = "";
  }, 1500);
});

// ===================== FLOATING GRID ON SCROLL =====================
let lastScrollY = 0;
window.addEventListener("scroll", () => {
  const delta = window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;
  const grid = document.querySelector(".hero-grid-overlay");
  if (grid) {
    const shift = (window.scrollY * 0.15).toFixed(2);
    grid.style.transform = `translateY(${shift}px)`;
  }
});

// ===================== ACTIVE NAV HIGHLIGHT =====================
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-link");

function setActiveNav() {
  const scrollPos = window.scrollY + 100;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    if (scrollPos >= top && scrollPos < top + height) {
      navLinksAll.forEach((l) => l.classList.remove("active"));
      document
        .querySelector(`.nav-link[href="#${id}"]`)
        ?.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActiveNav);

// ===================== SECTION REVEAL FADE-IN =====================
const revealEls = document.querySelectorAll(
  ".about-grid, .skills-grid, .projects-grid, .mindset-cards, .contact-grid",
);
revealEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  onVisible(
    el,
    (target) => {
      target.style.opacity = "1";
      target.style.transform = "translateY(0)";
    },
    0.05,
  );
});

// ===================== SECTION TITLE REVEAL =====================
document.querySelectorAll(".section-title, .section-label").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  onVisible(
    el,
    (t) => {
      t.style.opacity = "1";
      t.style.transform = "translateY(0)";
    },
    0.1,
  );
});

// ===================== GLITCH EFFECT ON LOGO =====================
const logo = document.querySelector(".nav-logo");
logo?.addEventListener("mouseenter", () => {
  logo.style.textShadow = `2px 0 var(--green), -2px 0 #ff0080`;
  setTimeout(() => {
    logo.style.textShadow = "";
  }, 300);
});

console.log(
  `%c
  ██████╗ ██████╗  █████╗ ██╗██████╗ 
  ██╔═══██╗██╔══██╗██╔══██╗██║██╔══██╗
  ██║   ██║██████╔╝███████║██║██║  ██║
  ██║   ██║██╔══██╗██╔══██║██║██║  ██║
  ╚██████╔╝██████╔╝██║  ██║██║██████╔╝
   ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝ 
  
  Hey, you like looking under the hood? So do I.
  I'm Obaid — 17, Mumbai. Let's connect.
`,
  "color: #00ffab; font-family: monospace; font-size: 11px;",
);
