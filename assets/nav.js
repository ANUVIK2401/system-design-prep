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

  let html = `<a class="sb-logo" href="${homePath}">SD Prep ↗</a>`;

  if (sections.length) {
    html += `<div class="sb-label">On this page</div>`;
    sections.forEach(s => {
      html += `<a class="sb-link" href="#${s.id}" data-sec="${s.id}">${s.label}</a>`;
    });
  }

  const cats = [...new Set(TOPICS.map(t => t.cat))];
  cats.forEach(cat => {
    html += `<div class="sb-label">${cat}</div>`;
    TOPICS.filter(t => t.cat === cat).forEach(t => {
      const active = t.slug === curSlug ? ' active' : '';
      html += `<a class="sb-link${active}" href="${topicPre}${t.slug}.html">${t.name}</a>`;
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
})();
