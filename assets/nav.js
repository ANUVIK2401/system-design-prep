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
    { slug: 'url-shortener',      name: 'URL Shortener',       cat: 'Questions', dir: '' },
    { slug: 'bitly',              name: 'Design Bitly',        cat: 'Questions', dir: 'questions/' },
    { slug: 'dropbox',            name: 'Design Dropbox',      cat: 'Questions', dir: 'questions/' },
    { slug: 'local-delivery',     name: 'Local Delivery',      cat: 'Questions', dir: 'questions/' },
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
    <div class="sb-progress-track"><div class="sb-progress-fill" style="width:${(doneCount / TOPICS.length) * 100}%"></div></div>
  </div>`;

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
      html += `<a class="sb-link sb-topic-link${active}${stateClass}" href="${rootToTopics}${t.dir}${t.slug}.html">${marker}<span class="sb-topic-name">${t.name}</span></a>`;
    });
    html += `</div></div></div>`;
  });
  html += `</div>`;

  sidebar.innerHTML = html;

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

  // ── Generic hover tooltip for any [data-tip] inside a .diagram-wrap ──
  document.querySelectorAll('.diagram-wrap').forEach(wrap => {
    const tip = document.createElement('div');
    tip.className = 'diag-tip';
    wrap.appendChild(tip);
    wrap.querySelectorAll('[data-tip]').forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        tip.textContent = el.dataset.tip;
        const wrapRect = wrap.getBoundingClientRect();
        const elRect = (el.querySelector('rect,circle') || el).getBoundingClientRect();
        tip.style.left = (elRect.left - wrapRect.left + elRect.width / 2) + 'px';
        tip.style.top = (elRect.top - wrapRect.top) + 'px';
        tip.classList.add('show');
      });
      el.addEventListener('mouseleave', () => tip.classList.remove('show'));
    });
  });

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
