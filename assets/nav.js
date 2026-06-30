(function () {
  const TOPICS = [
    { slug: 'sd-introduction',    name: 'Introduction',        cat: 'Foundations' },
    { slug: 'how-to-prepare',     name: 'How to Prepare',      cat: 'Foundations' },
    { slug: 'delivery-framework', name: 'Delivery Framework',  cat: 'Foundations' },
    { slug: 'core-concepts',      name: 'Core Concepts',       cat: 'Foundations' },
    { slug: 'key-technologies',   name: 'Key Technologies',    cat: 'Foundations' },
    { slug: 'common-patterns',    name: 'Common Patterns',     cat: 'Foundations' },
    { slug: 'question-breakdowns',name: 'Question Breakdowns', cat: 'Questions'   },
    { slug: 'url-shortener',      name: 'URL Shortener',       cat: 'Questions'   },
  ];

  const sidebar  = document.getElementById('sidebar');
  if (!sidebar) return;

  const parts    = location.pathname.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1] || '';
  const curSlug  = fileName.replace('.html', '');
  const inTopics = parts[parts.length - 2] === 'topics';

  // Determine prefix: from root index → topics are at topics/[slug].html
  // From a topics/* page → topics are at [slug].html (same dir)
  const topicPre = inTopics ? '' : 'topics/';
  const homePath = inTopics ? '../index.html' : 'index.html';

  const sections = Array.from(document.querySelectorAll('section[id]')).map(el => ({
    id: el.id,
    label: el.querySelector('h2')?.textContent || el.id
  }));

  // ── Visited-page tracking (localStorage) for progression ──
  const VISITED_KEY = 'sdprep-visited';
  let visited = [];
  try { visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'); } catch (e) { visited = []; }
  if (curSlug && TOPICS.some(t => t.slug === curSlug) && !visited.includes(curSlug)) {
    visited.push(curSlug);
    try { localStorage.setItem(VISITED_KEY, JSON.stringify(visited)); } catch (e) {}
  }

  let html = `<a class="sb-logo" href="${homePath}">SD Prep ↗</a>`;

  const doneCount = TOPICS.filter(t => visited.includes(t.slug)).length;
  html += `<div class="sb-progress-wrap">
    <div class="sb-progress-row">
      <span>Your progress</span>
      <span class="sb-progress-count">${doneCount}/${TOPICS.length}</span>
    </div>
    <div class="sb-progress-track"><div class="sb-progress-fill" style="width:${(doneCount / TOPICS.length) * 100}%"></div></div>
  </div>`;

  if (sections.length) {
    html += `<div class="sb-label">On this page</div>`;
    sections.forEach(s => {
      html += `<a class="sb-link sb-sublink" href="#${s.id}" data-sec="${s.id}">${s.label}</a>`;
    });
  }

  const cats = [...new Set(TOPICS.map(t => t.cat))];
  let stepNum = 0;
  cats.forEach(cat => {
    html += `<div class="sb-label">${cat}</div>`;
    TOPICS.filter(t => t.cat === cat).forEach(t => {
      stepNum++;
      const active = t.slug === curSlug ? ' active' : '';
      const isDone = visited.includes(t.slug) && t.slug !== curSlug;
      const num = String(stepNum).padStart(2, '0');
      const stateClass = isDone ? ' done' : '';
      const marker = isDone
        ? `<span class="sb-step-mark sb-step-check">✓</span>`
        : `<span class="sb-step-mark">${num}</span>`;
      html += `<a class="sb-link sb-topic-link${active}${stateClass}" href="${topicPre}${t.slug}.html">${marker}<span class="sb-topic-name">${t.name}</span></a>`;
    });
  });

  sidebar.innerHTML = html;

  // Scroll-spy
  if (sections.length) {
    const links = sidebar.querySelectorAll('[data-sec]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = sidebar.querySelector(`[data-sec="${e.target.id}"]`);
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    document.querySelectorAll('section[id]').forEach(el => obs.observe(el));
  }

  // Mobile hamburger
  const burger = document.createElement('button');
  burger.id    = 'hamburger';
  burger.setAttribute('aria-label', 'Open menu');
  burger.textContent = '☰';
  document.body.prepend(burger);

  const overlay = document.createElement('div');
  overlay.className = 'sb-overlay';
  document.body.append(overlay);

  burger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  // ── Scroll progress bar ──
  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ── Section icons (monochrome inline SVG, 14px) ──
  const ICONS = {
    'mental-model':     '<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v3l2 2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    'core-concepts':    '<svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="2" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="2" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="9" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    'how-it-works':     '<svg viewBox="0 0 16 16" width="14" height="14"><rect x="1" y="6" width="4" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="6" width="4" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h6" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#navArrow)"/></svg>',
    'kafka-pattern':    '<svg viewBox="0 0 16 16" width="14" height="14"><rect x="1" y="6" width="4" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="6" width="4" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    'sql-vs-nosql':     '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v3M3 5h10M4 5l-1.5 7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1L6 5M12 5l-1.5 7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1L14 5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'tradeoffs':        '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v3M3 5h10M4 5l-1.5 7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1L6 5M12 5l-1.5 7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1L14 5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'when-to-use':      '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1 14 4v4c0 4-2.7 6-6 7-3.3-1-6-3-6-7V4l6-3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5.5 8l1.7 1.7L10.5 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'interview-moves':  '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 3h10v7H7l-3 3v-3H3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5.5 6h5M5.5 8.2h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
    'follow-ups':       '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 3h8v6H6l-2.5 2.5V9H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="12.5" cy="10.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
  };
  const CHEVRON = '<svg class="sec-chevron" viewBox="0 0 16 16" width="11" height="11"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  document.querySelectorAll('main > section[id]').forEach(sec => {
    const h2 = sec.querySelector(':scope > h2');
    if (!h2) return;

    // Wrap remaining content (everything after h2) into a collapsible body
    const body = document.createElement('div');
    body.className = 'sec-body';
    let node = h2.nextSibling;
    while (node) {
      const next = node.nextSibling;
      body.appendChild(node);
      node = next;
    }
    sec.appendChild(body);

    // Icon + chevron in header
    const icon = ICONS[sec.id];
    if (icon) {
      const span = document.createElement('span');
      span.className = 'sec-icon';
      span.innerHTML = icon;
      h2.prepend(span);
    }
    h2.insertAdjacentHTML('beforeend', CHEVRON);

    h2.addEventListener('click', () => sec.classList.toggle('collapsed'));
  });

  // ── Fade-in on scroll (sections + cards) ──
  const revealTargets = document.querySelectorAll('main > section[id], .diagram-wrap, .compare-grid, .flash-card');
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => revealObs.observe(el));

  // ── Diagram box click → scroll to + highlight matching detail section ──
  document.querySelectorAll('[data-target]').forEach(box => {
    if (!box.querySelector('.diag-box')) return;
    box.style.cursor = 'pointer';
    box.addEventListener('click', () => {
      const target = document.getElementById(box.dataset.target);
      if (!target) return;
      target.classList.remove('collapsed');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.style.transition = 'box-shadow 0.3s ease';
      target.style.boxShadow = '0 0 0 2px var(--accent)';
      target.style.borderRadius = '8px';
      setTimeout(() => { target.style.boxShadow = 'none'; }, 1400);
    });
  });

  // ── Diagram hover → highlight full request path ──
  document.querySelectorAll('.diagram-wrap[data-paths]').forEach(wrap => {
    let paths;
    try { paths = JSON.parse(wrap.dataset.paths); } catch (e) { paths = null; }
    if (!paths) return;
    wrap.querySelectorAll('.diag-box[data-id]').forEach(box => {
      const id = box.dataset.id;
      const route = paths[id];
      if (!route) return;
      box.addEventListener('mouseenter', () => {
        wrap.classList.add('path-active');
        route.boxes.forEach(b => wrap.querySelector(`.diag-box[data-id="${b}"]`)?.classList.add('path-on'));
        route.arrows.forEach(a => wrap.querySelector(`.diag-arrow-path[data-id="${a}"]`)?.classList.add('path-on'));
      });
      box.addEventListener('mouseleave', () => {
        wrap.classList.remove('path-active');
        wrap.querySelectorAll('.path-on').forEach(el => el.classList.remove('path-on'));
      });
    });
  });
})();
