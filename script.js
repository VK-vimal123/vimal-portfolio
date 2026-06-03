const navbar = document.getElementById('navbar');
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const sections = document.querySelectorAll('main section[id]');
const navLinkItems = document.querySelectorAll('.nav-link');

function setTheme(theme) {
  document.documentElement.classList.toggle('light-theme', theme === 'light');
  localStorage.setItem('preferredTheme', theme);
}

function initializeTheme() {
  const storedTheme = localStorage.getItem('preferredTheme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(storedTheme || (prefersLight ? 'light' : 'dark'));
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains('light-theme');
  setTheme(isLight ? 'dark' : 'light');
}

function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) currentSection = section.id;
  });
  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}

navHamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !navHamburger.contains(event.target)) {
    navLinks.classList.remove('open');
  }
});

themeToggle.addEventListener('click', toggleTheme);
initializeTheme();

window.addEventListener('scroll', () => {
  handleNavScroll();
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
handleNavScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    if (anchor.getAttribute('href') === '#') return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

const revealElements = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseFloat(entry.target.dataset.delay || '0');
      setTimeout(() => entry.target.classList.add('revealed'), delay * 1000);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

const skillFills = document.querySelectorAll('.skill-fill');
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach((fill) => {
          fill.style.width = `${fill.dataset.percent}%`;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });
  skillObserver.observe(skillsSection);
}

function animateCounter(el, target) {
  const duration = 1200;
  let start = 0;
  const step = (timestamp, startTime) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) window.requestAnimationFrame((next) => step(next, startTime));
  };
  window.requestAnimationFrame(step);
}

const heroStats = document.querySelectorAll('.hero-stats span:first-child');
const heroSection = document.getElementById('home');
if (heroSection && heroStats.length) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(heroStats[0], 6);
        animateCounter(heroStats[1], 10);
        animateCounter(heroStats[2], 1);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(heroSection);
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete all fields.';
      formStatus.style.color = '#f87171';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = 'Enter a valid email address.';
      formStatus.style.color = '#f87171';
      return;
    }
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    setTimeout(() => {
      formStatus.textContent = 'Message sent! I’ll get back to you soon.';
      formStatus.style.color = '#34d399';
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      contactForm.reset();
      setTimeout(() => { formStatus.textContent = ''; }, 5000);
    }, 1400);
  });
}
