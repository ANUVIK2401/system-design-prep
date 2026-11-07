// Site chrome: top navbar, keyword search, breadcrumbs, prev/next pager, and diagram thumbnails.
(function () {
  const site = window.SD_SITE;
  if (!site) return;

  const script = document.currentScript.getAttribute('src');
  const root = script.replace('assets/chrome.js', '');
  const CATS = [
    { label: 'Foundations', href: 'index.html?cat=foundations#topics', cat: 'Foundations' },
    { label: 'Patterns', href: 'index.html?cat=patterns#topics', cat: 'Patterns' },
    { label: 'Technologies', href: 'index.html?cat=tech#topics', cat: 'Key Technologies' },
    { label: 'Advanced', href: 'index.html?cat=advanced#topics', cat: 'Advanced Topics' },
    { label: 'Questions', href: 'topics/question-breakdowns.html', cat: 'Questions' },
  ];
  const MAX_RESULTS = 12;
  const MAX_PER_PAGE = 2;
  const SNIPPET_RADIUS = 70;
  const SEARCH_DEBOUNCE_MS = 80;

  const slugOf = (path) => path.split('/').pop().split(/[?#]/)[0].replace('.html', '');
  const curSlug = slugOf(location.pathname);
  const current = site.TOPICS.find(t => t.slug === curSlug);
  const topicUrl = (t) => `${root}topics/${t.dir}${t.slug}.html`;
  const thumbUrl = (slug) => `${root}assets/thumbs/${slug}.svg`;

  function buildHeader() {
    const header = document.createElement('header');
    header.className = 'topbar';
    const links = CATS.map(c => {
      const here = current && current.cat === c.cat ? ' aria-current="true"' : '';
      return `<a href="${root}${c.href}"${here}>${c.label}</a>`;
    }).join('');
    header.innerHTML = `
      <a class="topbar-brand" href="${root}index.html"><img src="${root}assets/favicon.svg" width="26" height="26" alt="">System Design Prep</a>
      <nav class="topbar-nav" aria-label="Main navigation">${links}</nav>
      <div class="search" role="search">
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5 14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <input id="site-search" type="search" placeholder="Search topics and concepts" autocomplete="off" spellcheck="false"
          role="combobox" aria-label="Search topics and concepts" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">
        <kbd aria-hidden="true">/</kbd>
        <div id="search-results" class="search-results" role="listbox" aria-label="Search results" hidden></div>
      </div>`;
    document.body.prepend(header);
    const burger = document.getElementById('hamburger');
    if (burger) header.prepend(burger);
    return header;
  }

  function loadIndex() {
    if (loadIndex.promise) return loadIndex.promise;
    loadIndex.promise = new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = `${root}assets/search-index.js`;
      tag.onload = () => resolve(window.SD_SEARCH.map(e => ({
        ...e, lowPage: e.p.toLowerCase(), lowHead: e.h.toLowerCase(), lowText: e.t.toLowerCase(),
      })));
      tag.onerror = () => { loadIndex.promise = null; reject(new Error('search index failed to load')); };
      document.head.append(tag);
    });
    return loadIndex.promise;
  }

  function scoreEntry(entry, query, terms) {
    const all = `${entry.lowPage} ${entry.lowHead} ${entry.lowText}`;
    if (!terms.every(t => all.includes(t))) return 0;
    let score = 1;
    if (entry.lowPage === query) score += 200;
    if (entry.lowPage.includes(query)) score += 100;
    if (entry.lowHead.includes(query)) score += 60;
    if (entry.lowText.includes(query)) score += 25 + Math.min(entry.lowText.split(query).length, 10);
    terms.forEach(t => {
      if (entry.lowPage.includes(t)) score += 20;
      if (entry.lowHead.includes(t)) score += 10;
    });
    if (!entry.i) score += 2;
    return score;
  }

  function runSearch(entries, raw) {
    const query = raw.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const ranked = entries
      .map(entry => ({ entry, score: scoreEntry(entry, query, terms) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
    const perPage = new Map();
    const results = [];
    for (const r of ranked) {
      const seen = perPage.get(r.entry.u) || 0;
      if (seen >= MAX_PER_PAGE) continue;
      perPage.set(r.entry.u, seen + 1);
      results.push(r.entry);
      if (results.length === MAX_RESULTS) break;
    }
    return results;
  }

  // Builds with text nodes only: index text must never be parsed as HTML.
  function appendHighlighted(parent, text, terms) {
    const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    text.split(new RegExp(`(${pattern})`, 'ig')).forEach((part, i) => {
      if (!part) return;
      if (i % 2) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        parent.append(mark);
      } else {
        parent.append(part);
      }
    });
  }

  function snippetFor(entry, terms) {
    const at = terms.map(t => entry.lowText.indexOf(t)).filter(i => i >= 0).sort((a, b) => a - b)[0];
    if (at === undefined) return entry.t.slice(0, SNIPPET_RADIUS * 2);
    const start = Math.max(0, at - SNIPPET_RADIUS);
    const end = Math.min(entry.t.length, at + SNIPPET_RADIUS);
    return `${start ? '…' : ''}${entry.t.slice(start, end)}${end < entry.t.length ? '…' : ''}`;
  }

  function initSearch() {
    const input = document.getElementById('site-search');
    const panel = document.getElementById('search-results');
    let active = -1;
    let timer = null;

    const options = () => Array.from(panel.querySelectorAll('[role="option"]'));
    const close = () => {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };
    const setActive = (next) => {
      const list = options();
      if (!list.length) return;
      active = (next + list.length) % list.length;
      list.forEach((el, i) => el.setAttribute('aria-selected', String(i === active)));
      input.setAttribute('aria-activedescendant', list[active].id);
      list[active].scrollIntoView({ block: 'nearest' });
    };
    const showMessage = (message) => {
      const note = document.createElement('p');
      note.className = 'search-note';
      note.textContent = message;
      panel.replaceChildren(note);
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };
    const render = (results, raw) => {
      active = -1;
      if (!results.length) {
        showMessage(`No matches for "${raw.trim()}". Try one keyword, such as a technology or pattern.`);
        return;
      }
      const terms = raw.trim().toLowerCase().split(/\s+/);
      const rows = results.map((entry, i) => {
        const link = document.createElement('a');
        link.id = `search-option-${i}`;
        link.className = 'search-row';
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');
        link.href = `${root}${entry.u}${entry.i ? `#${entry.i}` : ''}`;
        const img = document.createElement('img');
        img.src = thumbUrl(slugOf(entry.u));
        img.alt = '';
        img.width = 72;
        img.height = 48;
        img.loading = 'lazy';
        const body = document.createElement('span');
        body.className = 'search-body';
        const title = document.createElement('strong');
        title.textContent = entry.p;
        const where = document.createElement('small');
        where.textContent = entry.h;
        const snippet = document.createElement('span');
        appendHighlighted(snippet, snippetFor(entry, terms), terms);
        body.append(title, where, snippet);
        link.append(img, body);
        return link;
      });
      panel.replaceChildren(...rows);
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };
    const update = async () => {
      const raw = input.value;
      if (!raw.trim()) { close(); return; }
      try {
        const entries = await loadIndex();
        if (input.value === raw) render(runSearch(entries, raw), raw);
      } catch (err) {
        showMessage('Search could not load. Check your connection and reload the page.');
      }
    };

    input.addEventListener('focus', () => { loadIndex().catch(() => {}); if (input.value.trim()) update(); });
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, SEARCH_DEBOUNCE_MS); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Escape') { close(); input.blur(); }
      else if (e.key === 'Enter') {
        const target = options()[active < 0 ? 0 : active];
        if (target) { e.preventDefault(); target.click(); }
      }
    });
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) close();
      const chip = e.target.closest('[data-search]');
      if (chip) {
        input.value = chip.dataset.search;
        input.focus();
        update();
        window.scrollTo({ top: 0 });
      }
    });
  }

  function addBreadcrumbs() {
    if (!current) return;
    const head = document.querySelector('.page-head');
    if (!head) return;
    const cat = CATS.find(c => c.cat === current.cat);
    const crumbs = document.createElement('nav');
    crumbs.className = 'crumbs';
    crumbs.setAttribute('aria-label', 'Breadcrumb');
    crumbs.innerHTML = `<a href="${root}index.html">Home</a><span aria-hidden="true">/</span><a href="${root}${cat.href}">${cat.label}</a><span aria-hidden="true">/</span><span aria-current="page">${current.name}</span>`;
    head.prepend(crumbs);
  }

  function addPager() {
    const at = site.TOPICS.indexOf(current);
    if (at < 0) return;
    const link = (topic, label) => topic
      ? `<a class="pager-card" href="${topicUrl(topic)}"><img src="${thumbUrl(topic.slug)}" width="160" height="90" alt="" loading="lazy"><span><small>${label}</small><strong>${topic.name}</strong></span></a>`
      : '<span></span>';
    const pager = document.createElement('nav');
    pager.className = 'pager';
    pager.setAttribute('aria-label', 'Previous and next topic');
    pager.innerHTML = link(site.TOPICS[at - 1], 'Previous') + link(site.TOPICS[at + 1], 'Next');
    document.querySelector('main').append(pager);
  }

  function addCardThumbs() {
    document.querySelectorAll('.topic-card').forEach(card => {
      const img = document.createElement('img');
      img.className = 'card-thumb';
      img.src = thumbUrl(slugOf(card.getAttribute('href')));
      img.alt = '';
      img.width = 320;
      img.height = 150;
      img.loading = 'lazy';
      card.prepend(img);
    });
  }

  // Search and sidebar links can land on a section collapsed on small screens.
  function openHashTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target && target.classList.contains('collapsed')) {
      target.classList.remove('collapsed');
      target.scrollIntoView();
    }
  }

  function initDrawerState() {
    const burger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (!burger || !sidebar) return;
    burger.setAttribute('aria-controls', 'sidebar');
    const sync = () => burger.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
    new MutationObserver(sync).observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    sync();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) document.querySelector('.sb-overlay').click();
    });
  }

  buildHeader();
  initSearch();
  addBreadcrumbs();
  addPager();
  addCardThumbs();
  initDrawerState();
  openHashTarget();
  window.addEventListener('hashchange', openHashTarget);
})();
