(function () {
  const TOPICS = [
    { slug: 'sd-introduction',    name: 'Introduction',        cat: 'Foundations', dir: '' },
    { slug: 'how-to-prepare',     name: 'How to Prepare',      cat: 'Foundations', dir: '' },
    { slug: 'delivery-framework', name: 'Delivery Framework',  cat: 'Foundations', dir: '' },
    { slug: 'core-concepts',      name: 'Core Concepts',       cat: 'Foundations', dir: '' },
    { slug: 'key-technologies',   name: 'Key Technologies',    cat: 'Foundations', dir: '' },
    { slug: 'common-patterns',    name: 'Common Patterns',     cat: 'Foundations', dir: '' },

    { slug: 'real-time-updates',             name: 'Real-Time Updates',       cat: 'Patterns', dir: 'patterns/' },
    { slug: 'dealing-with-contention',       name: 'Dealing with Contention', cat: 'Patterns', dir: 'patterns/' },
    { slug: 'multi-step-processes',          name: 'Multi-Step Processes',    cat: 'Patterns', dir: 'patterns/' },
    { slug: 'scaling-reads',                 name: 'Scaling Reads',           cat: 'Patterns', dir: 'patterns/' },
    { slug: 'scaling-writes',                name: 'Scaling Writes',          cat: 'Patterns', dir: 'patterns/' },
    { slug: 'handling-large-blobs',          name: 'Handling Large Blobs',    cat: 'Patterns', dir: 'patterns/' },
    { slug: 'managing-long-running-processes', name: 'Long-Running Processes', cat: 'Patterns', dir: 'patterns/' },

    { slug: 'redis',         name: 'Redis',         cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'elasticsearch', name: 'Elasticsearch', cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'kafka',         name: 'Kafka',         cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'api-gateway',   name: 'API Gateway',   cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'cassandra',     name: 'Cassandra',     cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'dynamodb',      name: 'DynamoDB',      cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'postgresql',    name: 'PostgreSQL',    cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'flink',         name: 'Flink',         cat: 'Key Technologies', dir: 'tech/' },
    { slug: 'zookeeper',     name: 'ZooKeeper',     cat: 'Key Technologies', dir: 'tech/' },

    { slug: 'proximity-search',          name: 'Proximity Search',         cat: 'Advanced Topics', dir: 'advanced/' },
    { slug: 'data-structures-big-data',  name: 'Big Data Structures',      cat: 'Advanced Topics', dir: 'advanced/' },
    { slug: 'vector-databases',          name: 'Vector Databases',         cat: 'Advanced Topics', dir: 'advanced/' },
    { slug: 'time-series-databases',     name: 'Time-Series Databases',    cat: 'Advanced Topics', dir: 'advanced/' },

    { slug: 'question-breakdowns',name: 'Question Breakdowns', cat: 'Questions', dir: '' },
    { slug: 'url-shortener',      name: 'URL Shortener',       cat: 'Questions', dir: 'questions/' },
    { slug: 'bitly',              name: 'Design Bitly',        cat: 'Questions', dir: 'questions/' },
    { slug: 'dropbox',            name: 'Design Dropbox',      cat: 'Questions', dir: 'questions/' },
    { slug: 'local-delivery',     name: 'Local Delivery',      cat: 'Questions', dir: 'questions/' },
    { slug: 'news-aggregator',    name: 'News Aggregator',     cat: 'Questions', dir: 'questions/' },
    { slug: 'ticketmaster',       name: 'Ticketmaster',        cat: 'Questions', dir: 'questions/' },
    { slug: 'fb-news-feed',       name: 'Facebook News Feed',  cat: 'Questions', dir: 'questions/' },
    { slug: 'tinder',             name: 'Tinder',              cat: 'Questions', dir: 'questions/' },
    { slug: 'leetcode',           name: 'LeetCode',            cat: 'Questions', dir: 'questions/' },
    { slug: 'whatsapp',           name: 'WhatsApp',            cat: 'Questions', dir: 'questions/' },
    { slug: 'yelp',               name: 'Yelp',                cat: 'Questions', dir: 'questions/' },
    { slug: 'strava',             name: 'Strava',              cat: 'Questions', dir: 'questions/' },
    { slug: 'rate-limiter',       name: 'Rate Limiter',        cat: 'Questions', dir: 'questions/' },
    { slug: 'online-auction',     name: 'Online Auction',      cat: 'Questions', dir: 'questions/' },
    { slug: 'fb-live-comments',   name: 'FB Live Comments',    cat: 'Questions', dir: 'questions/' },
    { slug: 'fb-post-search',     name: 'FB Post Search',      cat: 'Questions', dir: 'questions/' },
    { slug: 'price-tracking',     name: 'Price Tracking',      cat: 'Questions', dir: 'questions/' },
    { slug: 'online-chess',       name: 'Online Chess',        cat: 'Questions', dir: 'questions/', tag: 'NEW' },
    { slug: 'instagram',          name: 'Instagram',           cat: 'Questions', dir: 'questions/' },
    { slug: 'youtube-top-k',      name: 'YouTube Top-K',       cat: 'Questions', dir: 'questions/' },
    { slug: 'uber',               name: 'Uber',                cat: 'Questions', dir: 'questions/' },
    { slug: 'robinhood',          name: 'Robinhood',           cat: 'Questions', dir: 'questions/' },
    { slug: 'google-docs',        name: 'Google Docs',         cat: 'Questions', dir: 'questions/' },
    { slug: 'distributed-cache',  name: 'Distributed Cache',   cat: 'Questions', dir: 'questions/' },
    { slug: 'job-scheduler',      name: 'Job Scheduler',       cat: 'Questions', dir: 'questions/' },
    { slug: 'web-crawler',        name: 'Web Crawler',         cat: 'Questions', dir: 'questions/' },
    { slug: 'ad-click-aggregator',name: 'Ad Click Aggregator', cat: 'Questions', dir: 'questions/' },
    { slug: 'payment-system',     name: 'Payment System',      cat: 'Questions', dir: 'questions/' },
    { slug: 'metrics-monitoring', name: 'Metrics Monitoring',  cat: 'Questions', dir: 'questions/' },
    { slug: 'chatgpt',            name: 'Design ChatGPT',      cat: 'Questions', dir: 'questions/' },
  ];

  const sidebar  = document.getElementById('sidebar');
  if (!sidebar) return;

  const CHEVRON_SVG = '<svg class="sb-cat-chevron" viewBox="0 0 16 16" width="11" height="11"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const parts      = location.pathname.split('/').filter(Boolean);
  const fileName   = parts[parts.length - 1] || '';
  const curSlug    = fileName.replace('.html', '');
  const parentDir  = parts[parts.length - 2] || '';
  const grandDir   = parts[parts.length - 3] || '';
  const inTopicsRoot = parentDir === 'topics';
  const inTopicsSub  = grandDir === 'topics'; // topics/patterns/x.html, topics/tech/x.html, topics/advanced/x.html
  const inTopics      = inTopicsRoot || inTopicsSub;

  // Path from the current page back to the site root's topics/ dir
  const rootToTopics = inTopicsSub ? '../../topics/' : (inTopicsRoot ? '../topics/' : 'topics/');
  const homePath      = inTopicsSub ? '../../index.html' : (inTopicsRoot ? '../index.html' : 'index.html');

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
    <div class="sb-progress-track"><div class="sb-progress-fill" style="width:0%"></div></div>
  </div>`;

  // ── "On this page" mini-TOC — current page's own h2 sections, active one tracked below ──
  if (sections.length) {
    html += `<div class="sb-ontoc-wrap">
      <div class="sb-ontoc-label">On this page</div>
      ${sections.map(s => `<a class="sb-ontoc-link" data-ontoc="${s.id}" href="#${s.id}">${s.label}</a>`).join('')}
    </div>`;
  }

  // ── Site map — collapsible category accordion ──
  html += `<div class="sb-sitemap">`;
  const cats = [...new Set(TOPICS.map(t => t.cat))];
  cats.forEach(cat => {
    const catTopics = TOPICS.filter(t => t.cat === cat);
    const containsActive = catTopics.some(t => t.slug === curSlug);
    const expanded = containsActive ? ' expanded' : '';
    html += `<div class="sb-cat${expanded}" data-cat="${cat}">
      <button type="button" class="sb-cat-head">
        <span class="sb-cat-name">${cat}</span>
        <span class="sb-cat-count">${catTopics.length}</span>
        ${CHEVRON_SVG}
      </button>
      <div class="sb-cat-body"><div class="sb-cat-body-inner">`;
    catTopics.forEach((t, i) => {
      const active = t.slug === curSlug ? ' active' : '';
      const isDone = visited.includes(t.slug) && t.slug !== curSlug;
      const num = String(i + 1).padStart(2, '0');
      const stateClass = isDone ? ' done' : '';
      const marker = isDone
        ? `<span class="sb-step-mark sb-step-check">✓</span>`
        : `<span class="sb-step-mark">${num}</span>`;
      const newTag = t.tag ? `<span class="sb-new-tag">${t.tag}</span>` : '';
      html += `<a class="sb-link sb-topic-link${active}${stateClass}" href="${rootToTopics}${t.dir}${t.slug}.html">${marker}<span class="sb-topic-name">${t.name}</span>${newTag}</a>`;
    });
    html += `</div></div></div>`;
  });
  html += `</div>`;

  sidebar.innerHTML = html;

  // Animate the progress fill from 0 to its real width on every page load
  const progressFill = sidebar.querySelector('.sb-progress-fill');
  if (progressFill) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      progressFill.style.width = `${(doneCount / TOPICS.length) * 100}%`;
    }));
  }

  // ── Accordion toggle (CSS grid-rows 0fr/1fr transition, no JS height calc) ──
  sidebar.querySelectorAll('.sb-cat-head').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.sb-cat').classList.toggle('expanded');
    });
  });

  // Scroll-spy
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

  // ── Scroll progress bar + scroll-to-top button (one shared passive scroll handler) ──
  const progress = document.createElement('div');
  progress.id = 'scroll-progress';
  document.body.appendChild(progress);

  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scroll-top-btn';
  scrollTopBtn.type = 'button';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(scrollTopBtn);
  scrollTopBtn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  const SCROLL_TOP_THRESHOLD = 400;
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
    scrollTopBtn.classList.toggle('visible', scrolled > SCROLL_TOP_THRESHOLD);
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ── Touch: swipe right from the left edge opens the sidebar; swipe left on the open sidebar closes it ──
  (function initSwipeNav() {
    const SWIPE_THRESHOLD = 60;   // px of horizontal travel
    const EDGE_ZONE = 60;         // px from left edge that can start an open-swipe
    const MIN_VELOCITY = 0.3;     // px/ms — distinguishes a swipe from a slow scroll-drag
    let startX = 0, startY = 0, startT = 0, tracking = false, fromEdge = false;

    document.addEventListener('touchstart', (e) => {
      if (!window.matchMedia('(max-width: 1024px)').matches) return;
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; startT = performance.now();
      fromEdge = startX <= EDGE_ZONE;
      tracking = fromEdge || sidebar.classList.contains('open');
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Math.max(performance.now() - startT, 1);
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return; // vertical scroll, not a swipe
      if (Math.abs(dx) / dt < MIN_VELOCITY) return;
      if (dx > 0 && fromEdge && !sidebar.classList.contains('open')) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
      } else if (dx < 0 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      }
    }, { passive: true });
  })();

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

  // Collapse defaults: MacBook (>1024px) → everything expanded (chevron still works).
  // iPad/mobile (<=1024px) → only the first section (Step 1) starts open; rest collapsed, user opens as they study.
  const isNarrow = window.matchMedia('(max-width: 1024px)').matches;
  const allSections = Array.from(document.querySelectorAll('main > section[id]'));

  allSections.forEach((sec, i) => {
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

    if (isNarrow && i !== 0) sec.classList.add('collapsed');

    h2.addEventListener('click', () => sec.classList.toggle('collapsed'));
  });

  // ── Fade-in on scroll (sections + cards), staggered 60ms between siblings ──
  const revealTargets = document.querySelectorAll('main > section[id], .diagram-wrap, .compare-grid, .flash-card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (!reduceMotion) el.style.setProperty('--reveal-delay', `${(i % 6) * 60}ms`);
  });
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => revealObs.observe(el));

  // ── Diagram box click → mint pulse (300ms) then scroll to + highlight matching detail section ──
  document.querySelectorAll('[data-target]').forEach(box => {
    const diagBox = box.querySelector('.diag-box');
    if (!diagBox) return;
    box.style.cursor = 'pointer';
    box.addEventListener('click', () => {
      diagBox.classList.remove('box-clicked');
      void diagBox.offsetWidth; // restart animation
      diagBox.classList.add('box-clicked');
      const target = document.getElementById(box.dataset.target);
      if (!target) return;
      target.classList.remove('collapsed');
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.style.transition = 'box-shadow 0.3s ease';
      target.style.boxShadow = '0 0 0 2px var(--accent)';
      target.style.borderRadius = '8px';
      setTimeout(() => { target.style.boxShadow = 'none'; }, 1400);
    });
  });

  // ── Diagram box click → slide-in detail panel (role/tech/why/latency) + full path isolation, no page scroll ──
  // Doubles as the Architecture (Step 5) diagram's click-to-isolate: dims unrelated boxes/arrows,
  // brightens the clicked box + its connected arrows, and resets on a click outside any box.
  document.querySelectorAll('.diagram-wrap').forEach(wrap => {
    const nodes = wrap.querySelectorAll('[data-detail-name]');
    if (!nodes.length) return;
    const panel = document.createElement('div');
    panel.className = 'diag-detail-panel';
    panel.innerHTML = `
      <button type="button" class="diag-detail-close" aria-label="Close">
        <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <div class="diag-detail-name"></div>
      <div class="diag-detail-row"><div class="diag-detail-label">Type</div><div class="diag-detail-val" data-field="role"></div></div>
      <div class="diag-detail-row"><div class="diag-detail-label">Tech choice</div><div class="diag-detail-val" data-field="tech"></div></div>
      <div class="diag-detail-row"><div class="diag-detail-label">Why</div><div class="diag-detail-val" data-field="why"></div></div>
      <div class="diag-detail-row"><div class="diag-detail-label">Failure impact</div><div class="diag-detail-val latency" data-field="latency"></div></div>
    `;
    wrap.appendChild(panel);

    let paths = null;
    if (wrap.dataset.paths) { try { paths = JSON.parse(wrap.dataset.paths); } catch (e) { paths = null; } }

    const resetIsolation = () => {
      wrap.classList.remove('path-active');
      wrap.querySelectorAll('.path-on').forEach(el => el.classList.remove('path-on'));
      wrap.querySelectorAll('.diag-box.box-clicked').forEach(el => el.classList.remove('box-clicked'));
    };
    const closePanel = () => { panel.classList.remove('open'); resetIsolation(); };
    panel.querySelector('.diag-detail-close').addEventListener('click', closePanel);

    nodes.forEach(node => {
      node.style.cursor = 'pointer';
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.querySelector('.diag-detail-name').textContent = node.dataset.detailName || '';
        panel.querySelector('[data-field="role"]').textContent = node.dataset.detailRole || '—';
        panel.querySelector('[data-field="tech"]').textContent = node.dataset.detailTech || '—';
        panel.querySelector('[data-field="why"]').textContent = node.dataset.detailWhy || '—';
        panel.querySelector('[data-field="latency"]').textContent = node.dataset.detailLatency || '—';
        panel.classList.add('open');

        resetIsolation();
        const diagBox = node.querySelector('.diag-box');
        if (diagBox) diagBox.classList.add('box-clicked');

        // Isolate this node's path if the diagram declares one; otherwise just isolate the clicked box itself.
        const id = node.dataset.id;
        const route = (paths && id) ? paths[id] : null;
        wrap.classList.add('path-active');
        if (route) {
          route.boxes.forEach(b => wrap.querySelectorAll(`.diag-box[data-id="${b}"]`).forEach(el => el.classList.add('path-on')));
          route.arrows.forEach(a => wrap.querySelectorAll(`.diag-arrow-path[data-id="${a}"]`).forEach(el => el.classList.add('path-on')));
        } else if (diagBox) {
          diagBox.classList.add('path-on');
        }
      });
    });

    // Click anywhere outside a component box (but inside the diagram) resets isolation + closes the panel.
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('[data-detail-name]') || e.target.closest('.diag-detail-panel')) return;
      closePanel();
    });
  });
  // Click outside the diagram entirely also resets any open panel.
  document.addEventListener('click', (e) => {
    if (e.target.closest('.diagram-wrap')) return;
    document.querySelectorAll('.diag-detail-panel.open').forEach(panel => {
      panel.classList.remove('open');
      const wrap = panel.closest('.diagram-wrap');
      if (!wrap) return;
      wrap.classList.remove('path-active');
      wrap.querySelectorAll('.path-on').forEach(el => el.classList.remove('path-on'));
      wrap.querySelectorAll('.diag-box.box-clicked').forEach(el => el.classList.remove('box-clicked'));
    });
  });

  // ── Data flow dots: color by path type (write=blue, read=amber async, read=mint default) ──
  document.querySelectorAll('.diag-flow-dot[data-flow]').forEach(dot => {
    const kind = dot.dataset.flow; // 'write' | 'read' | 'async'
    if (kind === 'write') dot.classList.add('dot-write');
    else if (kind === 'async') dot.classList.add('dot-async');
    else if (kind === 'read') dot.classList.add('dot-read');
  });

  // ── State machine arrows: draw themselves in sequentially on first scroll into view ──
  document.querySelectorAll('svg').forEach(svg => {
    const arrows = svg.querySelectorAll('.state-arrow');
    if (!arrows.length) return;
    arrows.forEach(a => a.classList.add('draw-in'));
    const svgObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        arrows.forEach((a, i) => {
          setTimeout(() => a.classList.add('drawn'), reduceMotion ? 0 : i * 400);
        });
        svgObs.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    svgObs.observe(svg);
  });

  // ── Stat grid numbers: count up from 0 on first scroll into view (800ms, ease-out) ──
  function animateCount(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const end = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(end)) return;
    const decimals = (numStr.split('.')[1] || '').length;
    const duration = 800;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const val = end * eased;
      el.textContent = prefix + val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = raw;
    }
    requestAnimationFrame(frame);
  }
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (!reduceMotion) animateCount(e.target);
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-val').forEach(el => statObs.observe(el));

  // ── Step pills: brief scale pulse (1.0→1.05→1.0) when scrolled into view ──
  document.querySelectorAll('.step-pill').forEach(pill => {
    const pillObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !reduceMotion) {
          pill.classList.add('pill-active');
          setTimeout(() => pill.classList.remove('pill-active'), 200);
        }
      });
    }, { threshold: 0.6 });
    pillObs.observe(pill);
  });

  // ── Decision dials: slide from 50% to actual position on first scroll into view ──
  document.querySelectorAll('.dial-wrap').forEach(wrap => {
    const marker = wrap.querySelector('.dial-marker');
    if (!marker) return;
    const finalLeft = marker.style.left;
    marker.style.left = '50%';
    const dialObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => { marker.style.left = finalLeft; });
          dialObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    dialObs.observe(wrap);
  });

  // ── Follow-up Q&A: expand/collapse animation on click ──
  document.querySelectorAll('.qa-block').forEach(block => {
    const q = block.querySelector('.qa-q');
    const a = block.querySelector('.qa-a');
    if (!q || !a) return;
    a.style.maxHeight = 'none';
    q.addEventListener('click', () => {
      const collapsed = a.style.maxHeight === '0px';
      if (collapsed) {
        a.style.maxHeight = a.scrollHeight + 'px';
        a.style.opacity = '1';
        setTimeout(() => { if (a.style.maxHeight !== '0px') a.style.maxHeight = 'none'; }, 200);
      } else {
        a.style.maxHeight = a.scrollHeight + 'px';
        requestAnimationFrame(() => {
          a.style.maxHeight = '0px';
          a.style.opacity = '0.3';
        });
      }
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
        route.boxes.forEach(b => wrap.querySelectorAll(`.diag-box[data-id="${b}"]`).forEach(el => el.classList.add('path-on')));
        route.arrows.forEach(a => wrap.querySelectorAll(`.diag-arrow-path[data-id="${a}"]`).forEach(el => el.classList.add('path-on')));
      });
      box.addEventListener('mouseleave', () => {
        wrap.classList.remove('path-active');
        wrap.querySelectorAll('.path-on').forEach(el => el.classList.remove('path-on'));
      });
    });
  });

  // ── Generic tooltip for any [data-tip] inside a .diagram-wrap: hover on desktop, long-press (500ms) on touch ──
  document.querySelectorAll('.diagram-wrap').forEach(wrap => {
    const tip = document.createElement('div');
    tip.className = 'diag-tip';
    wrap.appendChild(tip);
    const showTip = (el) => {
      tip.textContent = el.dataset.tip;
      const wrapRect = wrap.getBoundingClientRect();
      const elRect = (el.querySelector('rect,circle') || el).getBoundingClientRect();
      tip.style.left = (elRect.left - wrapRect.left + elRect.width / 2) + 'px';
      tip.style.top = (elRect.top - wrapRect.top) + 'px'; // anchored above the node — above the finger on touch
      tip.classList.add('show');
    };
    wrap.querySelectorAll('[data-tip]').forEach(el => {
      el.addEventListener('mouseenter', () => showTip(el));
      el.addEventListener('mouseleave', () => tip.classList.remove('show'));

      const LONG_PRESS_MS = 500;
      let pressTimer = null;
      el.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => showTip(el), LONG_PRESS_MS);
      }, { passive: true });
      ['touchend', 'touchmove', 'touchcancel'].forEach(ev => {
        el.addEventListener(ev, () => {
          clearTimeout(pressTimer);
          if (ev !== 'touchmove') setTimeout(() => tip.classList.remove('show'), ev === 'touchend' ? 1200 : 0);
        }, { passive: true });
      });
    });
  });

  // ── Interview moves: clipboard copy button — copies the verbatim bold phrase ──
  document.querySelectorAll('.moves-list li').forEach(li => {
    const strong = li.querySelector('strong');
    if (!strong) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'move-copy-btn';
    btn.setAttribute('aria-label', 'Copy phrase to clipboard');
    btn.innerHTML = '<svg viewBox="0 0 16 16"><rect x="5" y="5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 10.5V3a1 1 0 0 1 1-1H11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    btn.addEventListener('click', () => {
      const text = strong.textContent.replace(/^"|"$/g, '');
      navigator.clipboard?.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<svg viewBox="0 0 16 16"><rect x="5" y="5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 10.5V3a1 1 0 0 1 1-1H11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
        }, 1400);
      }).catch(() => {});
    });
    li.appendChild(btn);
  });

  // ── Section h2: mark active while scrolled within its section (drives underline + sidebar TOC + step tracker) ──
  document.querySelectorAll('main > section[id] > h2').forEach(h2 => {
    const sec = h2.closest('section');
    const ontocLink = sidebar.querySelector(`.sb-ontoc-link[data-ontoc="${sec.id}"]`);
    const trackerItem = document.querySelector(`.step-tracker-item[data-tracker="${sec.id}"]`);
    const h2Obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        h2.classList.toggle('h2-active', e.isIntersecting);
        ontocLink?.classList.toggle('ontoc-active', e.isIntersecting);
        trackerItem?.classList.toggle('tracker-active', e.isIntersecting);
      });
    }, { rootMargin: '-10% 0px -70% 0px' });
    h2Obs.observe(sec);
  });

  // ── Global sticky step tracker: [1 REQ] → [2 ENTITIES] → ... → [6 DEEP DIVE], replaces goal-arc + per-section step-pill ──
  (function buildStepTracker() {
    const STEP_LABELS = {
      'step1-requirements': ['1', 'Req',      'REQ'],
      'step2-entities':     ['2', 'Entities', 'ENT'],
      'step3-api':          ['3', 'API',      'API'],
      'step4-dataflow':     ['4', 'Flow',     'FLOW'],
      'step5-hld':          ['5', 'Design',   'HLD'],
    };
    const stepSections = allSections.filter(sec => STEP_LABELS[sec.id] || sec.id.startsWith('step6-deepdive'));
    if (!stepSections.length) return;

    // Collapse all step6-deepdive-* sections into a single "6 Deep Dive" tracker entry (first one wins the anchor).
    const seen = new Set();
    const items = [];
    stepSections.forEach(sec => {
      if (sec.id.startsWith('step6-deepdive')) {
        if (seen.has('step6')) return;
        seen.add('step6');
        items.push({ id: sec.id, num: '6', label: 'Deep Dive', abbr: 'DIVE' });
      } else {
        const [num, label, abbr] = STEP_LABELS[sec.id];
        items.push({ id: sec.id, num, label, abbr });
      }
    });
    if (items.length < 2) return; // not a 6-step framework page, skip

    const tracker = document.createElement('div');
    tracker.className = 'step-tracker';
    tracker.innerHTML = items.map((it, i) => `${i > 0 ? '<span class="step-tracker-arrow">→</span>' : ''}<a class="step-tracker-item" data-tracker="${it.id}" href="#${it.id}"><span class="step-tracker-num">${it.num}</span><span class="step-tracker-label lbl-full">${it.label.toUpperCase()}</span><span class="step-tracker-label lbl-abbr">${it.abbr}</span></a>`).join('');
    const main = document.querySelector('main');
    const firstSection = main.querySelector('section[id]');
    main.insertBefore(tracker, firstSection);

    // Mark all step6-deepdive-* sections as "done" once scrolled past, since they share one tracker entry.
    document.querySelectorAll('.step-tracker-item').forEach(item => {
      const targetId = item.dataset.tracker;
      const targetSec = document.getElementById(targetId);
      if (!targetSec) return;
      const doneObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          const rect = e.boundingClientRect;
          if (rect.top < 0 && !e.isIntersecting) item.classList.add('done');
          else if (!e.isIntersecting && rect.top > 0) item.classList.remove('done');
        });
      }, { threshold: 0 });
      doneObs.observe(targetSec);
    });
  })();

  // ── CAP theorem interactive corners ──
  const capDetail = document.getElementById('cap-detail');
  if (capDetail) {
    const CAP_INFO = {
      C: { guarantees: 'CP — Consistency + Partition Tolerance', sacrifice: 'Availability: during a partition, nodes that can\'t confirm the latest write return an error instead of stale data.', example: 'MongoDB (default), HBase, Zookeeper — chosen when correctness beats uptime.' },
      A: { guarantees: 'AP — Availability + Partition Tolerance', sacrifice: 'Consistency: during a partition, every node keeps responding, even with possibly stale data.', example: 'DynamoDB, Cassandra, CouchDB — chosen for high availability at internet scale.' },
      P: { guarantees: 'Partition tolerance is non-negotiable', sacrifice: 'Networks always partition eventually — P is never the thing you give up. The real choice is C vs A when a partition happens.', example: 'Every distributed system must handle P; CAP is really just "CP or AP?"' },
    };
    document.querySelectorAll('.cap-node').forEach(node => {
      const key = node.dataset.cap;
      const activate = () => {
        document.querySelectorAll('.cap-node').forEach(n => n.classList.remove('cap-active', 'cap-c', 'cap-a', 'cap-p'));
        node.classList.add('cap-active', 'cap-' + key.toLowerCase());
        const info = CAP_INFO[key];
        capDetail.querySelector('.cap-detail-title').textContent = info.guarantees;
        capDetail.querySelector('.cap-detail-body').innerHTML = `${info.sacrifice}<br><span class="cap-example">${info.example}</span>`;
      };
      node.addEventListener('click', activate);
      node.addEventListener('keypress', (e) => { if (e.key === 'Enter') activate(); });
    });
  }

  // ── Reusable: Consistent hash ring SVG generator ──
  // container: element to render into. opts: { nodes:[{id,label}], keys:[{id,label}], size }
  window.renderHashRing = function (container, opts) {
    const size = opts.size || 320;
    const cx = size / 2, cy = size / 2, r = size * 0.36;
    let nodes = opts.nodes.slice();
    const keys = opts.keys || [];

    function angleFor(hash) { return (hash / 360) * Math.PI * 2 - Math.PI / 2; }
    function posFor(hash) {
      const a = angleFor(hash);
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }
    function nearestNode(hash, nodeList) {
      const sorted = nodeList.slice().sort((a, b) => a.hash - b.hash);
      for (const n of sorted) if (hash <= n.hash) return n.id;
      return sorted[0].id;
    }

    function draw() {
      const sorted = nodes.slice().sort((a, b) => a.hash - b.hash);
      let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border2)" stroke-width="1.5"/>`;

      keys.forEach(k => {
        const owner = nearestNode(k.hash, sorted);
        const p = posFor(k.hash);
        const kr = r - 26;
        const a = angleFor(k.hash);
        const kp = { x: cx + kr * Math.cos(a), y: cy + kr * Math.sin(a) };
        const cls = k._remap ? 'key-remapped' : (k._settled ? 'key-stable' : '');
        svg += `<g class="hash-key ${cls}" data-tip="${k.label} → ${owner}">
          <circle cx="${kp.x}" cy="${kp.y}" r="4"/>
        </g>`;
      });

      sorted.forEach(n => {
        const p = posFor(n.hash);
        const labelR = r + 26;
        const a = angleFor(n.hash);
        const lp = { x: cx + labelR * Math.cos(a), y: cy + labelR * Math.sin(a) };
        const newCls = n._new ? ' hash-node-new' : '';
        svg += `<g class="hash-node${newCls}" data-tip="${n.label} owns this arc">
          <circle class="diag-box role-cache" cx="${p.x}" cy="${p.y}" r="9"/>
          <text class="diag-sublabel" x="${lp.x}" y="${lp.y}" style="font-size:10px">${n.label}</text>
        </g>`;
      });

      svg += `</svg>`;
      container.innerHTML = svg;
    }

    draw();

    return {
      addNode(newNode) {
        const sorted = nodes.slice().sort((a, b) => a.hash - b.hash);
        let successor = sorted.find(n => n.hash >= newNode.hash) || sorted[0];
        keys.forEach(k => {
          const wasOwner = nearestNode(k.hash, sorted);
          k._settled = true;
          k._remap = false;
        });
        nodes.push(Object.assign({}, newNode, { _new: true }));
        const afterSorted = nodes.slice().sort((a, b) => a.hash - b.hash);
        keys.forEach(k => {
          const newOwner = nearestNode(k.hash, afterSorted);
          if (newOwner === newNode.id) { k._remap = true; k._settled = false; }
        });
        draw();
        setTimeout(() => { nodes.forEach(n => n._new = false); }, 600);
      },
      reset(originalNodes) {
        nodes = originalNodes.slice();
        keys.forEach(k => { k._remap = false; k._settled = false; });
        draw();
      }
    };
  };

  // ── Reusable: Sharding write-path animator ──
  // container: element with an existing SVG containing .shard-box[data-shard] and a path for the dot to travel
  window.animateShardWrite = function (svgEl, shardId, pathD) {
    svgEl.querySelectorAll('.shard-box').forEach(b => b.classList.remove('shard-lit'));
    const target = svgEl.querySelector(`.shard-box[data-shard="${shardId}"]`);
    if (target) target.classList.add('shard-lit');
    const existingDot = svgEl.querySelector('.shard-write-dot');
    if (existingDot) existingDot.remove();
    if (!pathD) return;
    const ns = 'http://www.w3.org/2000/svg';
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '4');
    dot.classList.add('shard-write-dot');
    const animMotion = document.createElementNS(ns, 'animateMotion');
    animMotion.setAttribute('dur', '1.1s');
    animMotion.setAttribute('path', pathD);
    animMotion.setAttribute('fill', 'freeze');
    dot.appendChild(animMotion);
    svgEl.appendChild(dot);
    requestAnimationFrame(() => {
      dot.classList.add('shard-dot-active');
      animMotion.beginElement && animMotion.beginElement();
    });
  };
})();
