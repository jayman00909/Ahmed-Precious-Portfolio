document.documentElement.classList.add('js');

const portraitImages = document.querySelectorAll('.portrait-image');
if (portraitImages.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let activePortrait = 0;
  window.setInterval(() => {
    portraitImages[activePortrait].classList.remove('is-active');
    activePortrait = (activePortrait + 1) % portraitImages.length;
    portraitImages[activePortrait].classList.add('is-active');
  }, 5000);
}

const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open', !expanded);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      navToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeNav();
    }
  });
}

const revealElements = document.querySelectorAll('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

revealElements.forEach((element) => {
  const delay = Number(element.dataset.revealDelay || 0);
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${delay}ms`);
});

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const counters = document.querySelectorAll('[data-count]');
const formatCounter = (value, decimals) => new Intl.NumberFormat(undefined, {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals
}).format(value);

const finishCounter = (element) => {
  const value = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  element.textContent = `${prefix}${formatCounter(value, decimals)}${suffix}`;
};

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 4;
    const current = target * eased;
    element.textContent = `${prefix}${formatCounter(current, decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      finishCounter(element);
    }
  };

  requestAnimationFrame(tick);
};

if (reducedMotion || !('IntersectionObserver' in window)) {
  counters.forEach(finishCounter);
} else {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.55 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

if ('IntersectionObserver' in window) {
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const navSections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-20% 0px -68% 0px', threshold: 0 });

  navSections.forEach((section) => navObserver.observe(section));
}

const serviceOptions = document.querySelectorAll('input[name="service"]');
const projectScope = document.querySelector('#project-scope');
const projectDescription = document.querySelector('#project-description');
const proposalLink = document.querySelector('#proposal-link');

const updateProjectScope = () => {
  if (!projectScope || !projectDescription || !proposalLink) return;

  const selected = [...serviceOptions]
    .filter((option) => option.checked)
    .map((option) => option.value);

  if (!selected.length) {
    projectScope.textContent = 'Custom collaboration';
    projectDescription.textContent = 'Choose one or more services to shape the right project scope.';
  } else if (selected.length === 1) {
    projectScope.textContent = selected[0];
    projectDescription.textContent = `A focused ${selected[0].toLowerCase()} package tailored to your goals.`;
  } else {
    projectScope.textContent = selected.join(' + ');
    projectDescription.textContent = 'A combined content and operations scope with one clear, coordinated plan.';
  }

  const selectedSummary = selected.length ? selected.join(', ') : 'Custom collaboration';
  const subject = encodeURIComponent(`Project inquiry: ${selectedSummary}`);
  const body = encodeURIComponent(
    `Hello Ahmed,\n\nI would like to discuss the following project services:\n${selectedSummary}\n\nEstimated scope:\n${projectScope.textContent}\n\nProject details:\n`
  );
  proposalLink.href = `mailto:ahmedprecious84@gmail.com?subject=${subject}&body=${body}`;
};

serviceOptions.forEach((option) => option.addEventListener('change', updateProjectScope));
updateProjectScope();

const matrixTrigger = document.querySelector('.matrix-link');
const matrixDialog = document.querySelector('#matrix-dialog');
const matrixClose = matrixDialog?.querySelector('.matrix-dialog-close');

if (matrixTrigger && matrixDialog) {
  matrixTrigger.addEventListener('click', () => {
    if (typeof matrixDialog.showModal === 'function') {
      matrixDialog.showModal();
    } else {
      matrixDialog.setAttribute('open', '');
    }
  });

  const closeMatrix = () => {
    if (matrixDialog.classList.contains('is-closing')) return;

    matrixDialog.classList.add('is-closing');
    window.setTimeout(() => {
      matrixDialog.classList.remove('is-closing');
      if (typeof matrixDialog.close === 'function') {
        matrixDialog.close();
      } else {
        matrixDialog.removeAttribute('open');
      }
    }, 160);
  };

  matrixClose?.addEventListener('click', closeMatrix);

  matrixDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMatrix();
  });

  matrixDialog.addEventListener('click', (event) => {
    if (event.target === matrixDialog) {
      closeMatrix();
    }
  });
}
