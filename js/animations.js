// GSAP Animations & Interactions
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.29/dist/lenis.mjs';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

let lenis;
let isMobile = window.innerWidth < 768;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize smooth scroll (desktop only)
function initSmoothScroll() {
  if (!isMobile && !isReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// Custom cursor (desktop only)
function initCustomCursor() {
  if (isMobile || isReducedMotion) return;

  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = cursor.querySelector('.cursor-dot');
  const cursorRing = cursor.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .clip-card, .join-card, .profile-frame');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

// Section title glitch reveal
function initSectionTitles() {
  const titles = document.querySelectorAll('.section-title .title-text');

  titles.forEach(title => {
    const originalText = title.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&%';

    ScrollTrigger.create({
      trigger: title,
      start: 'top 80%',
      onEnter: () => {
        if (isReducedMotion) return;

        let iterations = 0;
        const maxIterations = 15;

        const interval = setInterval(() => {
          title.textContent = originalText
            .split('')
            .map((char, i) => {
              if (i < iterations / 3) return originalText[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          iterations++;
          if (iterations >= maxIterations) {
            clearInterval(interval);
            title.textContent = originalText;
          }
        }, 30);
      },
      once: true
    });
  });
}

// Clip cards staggered entry
function initClipCards() {
  const clipGrids = document.querySelectorAll('.clips-grid');

  clipGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.clip-card');

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 80%',
      onEnter: () => {
        if (isReducedMotion) return;

        gsap.from(cards, {
          y: 100,
          rotationX: 45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });
      },
      once: true
    });
  });
}

// Join cards 3D float
function initJoinCards() {
  const cards = document.querySelectorAll('.join-card');

  cards.forEach(card => {
    if (isMobile || isReducedMotion) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  ScrollTrigger.create({
    trigger: '.join-cards',
    start: 'top 80%',
    onEnter: () => {
      if (isReducedMotion) return;

      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    },
    once: true
  });
}

// Profile picture 3D tilt
function initProfileTilt() {
  const profileFrame = document.querySelector('.profile-frame');

  if (!profileFrame || isMobile || isReducedMotion) return;

  profileFrame.addEventListener('mousemove', (e) => {
    const rect = profileFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(profileFrame, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  profileFrame.addEventListener('mouseleave', () => {
    gsap.to(profileFrame, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
}

// Magnetic buttons
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.cta-button, .terminal-button');

  buttons.forEach(button => {
    if (isMobile || isReducedMotion) return;

    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

// Link glitch on hover
function initLinkGlitch() {
  const links = document.querySelectorAll('a:not(.cta-button):not(.terminal-button)');

  links.forEach(link => {
    if (isReducedMotion) return;

    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        x: [-2, 2, -1, 1, 0],
        duration: 0.2,
        ease: 'steps(4)'
      });
    });
  });
}

// Timecode update
function initTimecode() {
  const timecode = document.querySelector('.timecode');
  if (!timecode) return;

  function updateTimecode() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const frames = String(Math.floor(now.getMilliseconds() / 41.67)).padStart(2, '0');
    timecode.textContent = `${hours}:${minutes}:${seconds}:${frames}`;
    requestAnimationFrame(updateTimecode);
  }
  updateTimecode();
}

// Side progress indicator
function initSideProgress() {
  const dots = document.querySelectorAll('.progress-dot');
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateActiveDot(index),
      onEnterBack: () => updateActiveDot(index)
    });
  });

  function updateActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

// Scroll-based camera path
function initScrollCamera() {
  const totalScroll = document.body.scrollHeight - window.innerHeight;

  window.addEventListener('scroll', () => {
    const scrollProgress = window.scrollY / totalScroll;

    // Update Three.js camera
    if (window.updateScrollProgress) {
      window.updateScrollProgress(scrollProgress);
    }

    // Update section mood
    const sectionIndex = Math.floor(scrollProgress * 5);
    if (window.updateSectionMood) {
      window.updateSectionMood(sectionIndex);
    }
  });
}

// Initialize all animations
function initAnimations() {
  initSmoothScroll();
  initCustomCursor();
  initSectionTitles();
  initClipCards();
  initJoinCards();
  initProfileTilt();
  initMagneticButtons();
  initLinkGlitch();
  initTimecode();
  initSideProgress();
  initScrollCamera();
}

// Export functions for use in main.js
export { initAnimations, showToast };
