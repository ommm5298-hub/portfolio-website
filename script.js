/* ==========================================================================
   OMM PRAKASH MOHANTY — PORTFOLIO SCRIPT
   Sections: Preloader / Cursor / Hero web canvas / Thread trail canvas /
             Nav / Scroll reveal / Skill bars / Stat counters /
             Project modal / Timeline / Contact form / Ripple buttons
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. PRELOADER
     ------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('is-hidden');
      document.body.classList.add('loaded');
    }, 900);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader.classList.add('is-hidden'), 3500);

  /* ------------------------------------------------------------------
     2. CUSTOM CURSOR (dot + ring) — desktop only
     ------------------------------------------------------------------ */
  const isTouch = window.matchMedia('(hover: none), (max-width: 860px)').matches;
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .project-card, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ------------------------------------------------------------------
     3. WEB-THREAD TRAIL CANVAS — follows the cursor with a snapping thread
     ------------------------------------------------------------------ */
  const threadCanvas = document.getElementById('threadCanvas');
  if (!isTouch && threadCanvas) {
    const tctx = threadCanvas.getContext('2d');
    let tw = threadCanvas.width = window.innerWidth;
    let th = threadCanvas.height = window.innerHeight;

    let points = [];
    const MAX_POINTS = 14;
    let lastX = tw / 2, lastY = th / 2;

    window.addEventListener('mousemove', (e) => {
      points.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (points.length > MAX_POINTS) points.shift();
      lastX = e.clientX;
      lastY = e.clientY;
    });

    window.addEventListener('resize', () => {
      tw = threadCanvas.width = window.innerWidth;
      th = threadCanvas.height = window.innerHeight;
    });

    function drawThread() {
      tctx.clearRect(0, 0, tw, th);
      if (points.length > 1) {
        tctx.beginPath();
        tctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          tctx.lineTo(points[i].x, points[i].y);
        }
        tctx.strokeStyle = 'rgba(214, 40, 40, 0.35)';
        tctx.lineWidth = 1;
        tctx.stroke();
      }
      points.forEach(p => (p.life -= 0.07));
      points = points.filter(p => p.life > 0);
      requestAnimationFrame(drawThread);
    }
    drawThread();
  }

  /* ------------------------------------------------------------------
     4. HERO WEB BACKGROUND CANVAS — ambient spider-web node network
     ------------------------------------------------------------------ */
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let w, h, nodes;

    function sizeCanvas() {
      const hero = heroCanvas.parentElement;
      w = heroCanvas.width = hero.offsetWidth;
      h = heroCanvas.height = hero.offsetHeight;
    }

    function initNodes() {
      const count = window.innerWidth < 760 ? 34 : 64;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6
      }));
    }

    sizeCanvas();
    initNodes();

    let mouseNear = { x: w / 2, y: h / 2 };
    heroCanvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouseNear.x = e.clientX - rect.left;
      mouseNear.y = e.clientY - rect.top;
    });

    window.addEventListener('resize', () => {
      sizeCanvas();
      initNodes();
    });

    const LINK_DIST = 150;

    function tick() {
      ctx.clearRect(0, 0, w, h);

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const opacity = (1 - dist / LINK_DIST) * 0.16;
            ctx.strokeStyle = j % 2 === 0
              ? `rgba(43, 108, 255, ${opacity})`
              : `rgba(214, 40, 40, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // connect to cursor for a subtle web-sense feel
        const dxm = nodes[i].x - mouseNear.x, dym = nodes[i].y - mouseNear.y;
        const distm = Math.sqrt(dxm * dxm + dym * dym);
        if (distm < LINK_DIST * 1.3) {
          ctx.strokeStyle = `rgba(255, 90, 90, ${(1 - distm / (LINK_DIST * 1.3)) * 0.18})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseNear.x, mouseNear.y);
          ctx.stroke();
        }
      }

      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230, 235, 250, 0.35)';
        ctx.fill();
      });

      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ------------------------------------------------------------------
     5. NAV — scrolled state + mobile burger + smooth active link
     ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('is-open'));
  });

  /* ------------------------------------------------------------------
     6. SCROLL REVEAL — IntersectionObserver, staggered per section
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblingsInSameParent = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const staggerIndex = siblingsInSameParent.indexOf(el);
        el.style.transitionDelay = `${Math.min(staggerIndex, 6) * 80}ms`;
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     7. SKILL BARS — animate width when skills section enters view
     ------------------------------------------------------------------ */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          fill.style.width = fill.dataset.level + '%';
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  /* ------------------------------------------------------------------
     8. STAT COUNTERS — count up numbers in About section
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-card__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.count, 10);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 30));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = current;
          }, 40);
        });
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) counterObserver.observe(aboutSection);

  /* ------------------------------------------------------------------
     9. PROJECT MODAL
     ------------------------------------------------------------------ */
  const projectData = {
    sgpa: {
      index: '01',
      title: 'SGPA Simulator',
      desc: 'A responsive web application that calculates semester SGPA and CGPA based on subject grades and credits. Built to help fellow students quickly estimate their academic performance without manual calculation errors.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      live: 'https://bandita-07.github.io/SGPA_Simulator/',
      source: 'https://github.com/ommm5298-hub'
    },
    habit: {
      index: '02',
      title: 'Habit Battle',
      desc: 'A gamified productivity tracker where two users compete through daily habits, streaks, points, and rankings — designed to make consistency feel like a game rather than a chore.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      live: null,
      source: 'https://github.com/ommm5298-hub'
    },
    portfolio: {
      index: '03',
      title: 'Portfolio Website',
      desc: 'A cinematic, Spider-Man-inspired portfolio featuring custom animations, ambient web effects, responsive design, and a modern, recruiter-friendly UI — the very site you\'re looking at now.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      live: null,
      source: 'https://github.com/ommm5298-hub'
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalIndex = document.getElementById('modalIndex');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalStack = document.getElementById('modalStack');
  const modalLinks = document.getElementById('modalLinks');
  const modalClose = document.getElementById('modalClose');

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;

    modalIndex.textContent = data.index;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalStack.innerHTML = data.stack.map(s => `<span>${s}</span>`).join('');

    let linksHTML = '';
    if (data.live) {
      linksHTML += `<a href="${data.live}" target="_blank" rel="noopener" class="project-link">Live Demo ↗</a>`;
    } else {
      linksHTML += `<a href="#" class="project-link project-link--disabled">Live Demo ↗</a>`;
    }
    linksHTML += `<a href="${data.source}" target="_blank" rel="noopener" class="project-link">Source ↗</a>`;
    modalLinks.innerHTML = linksHTML;

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal));
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ------------------------------------------------------------------
     10. BUTTON RIPPLE EFFECT
     ------------------------------------------------------------------ */
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.classList.add('ripple');
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
      btn.classList.remove('ripple-play');
      void btn.offsetWidth; // restart animation
      btn.classList.add('ripple-play');
    });
  });

  /* ------------------------------------------------------------------
     11. CONTACT FORM — client-side handling (placeholder submission)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formBtnText = document.getElementById('formBtnText');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in every field before sending.';
        formStatus.classList.remove('is-success');
        return;
      }

      formBtnText.textContent = 'Sending...';

      // Placeholder submission — swap with a real endpoint (Formspree, EmailJS, etc.)
      setTimeout(() => {
        formBtnText.textContent = 'Send Message';
        formStatus.textContent = `Thanks, ${name.split(' ')[0]} — your message is queued. I'll reply at ${email} soon.`;
        formStatus.classList.add('is-success');
        contactForm.reset();
      }, 900);
    });
  }

  /* ------------------------------------------------------------------
     12. ACTIVE NAV LINK ON SCROLL
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}` ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-100px 0px -50% 0px' });

  sections.forEach(sec => navObserver.observe(sec));

});
