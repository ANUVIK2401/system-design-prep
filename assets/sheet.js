// Builds the one-page interview sheet on question pages from the page's own sections.
(function () {
  const main = document.querySelector('main');
  if (!main || !document.getElementById('step5-hld')) return;

  const MAX_PROBES = 4;
  const root = document.currentScript.getAttribute('src').replace('assets/sheet.js', '');
  const slug = location.pathname.split('/').pop().replace('.html', '');
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const all = (scope, selector) => Array.from(scope.querySelectorAll(selector));

  function make(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.append(content);
    return el;
  }

  function list(items, ordered) {
    const el = make(ordered ? 'ol' : 'ul', 'sheet-list');
    items.forEach(item => el.append(make('li', '', item)));
    return el;
  }

  function jumpLink(id, label) {
    const a = make('a', '', label);
    a.href = `#${id}`;
    return a;
  }

  // data-label lets rows stack as labelled blocks on phones.
  function table(headers, rows) {
    const t = make('table', 'sheet-table');
    const headRow = make('tr');
    headers.forEach(h => { const th = make('th', '', h); th.scope = 'col'; headRow.append(th); });
    const thead = make('thead');
    thead.append(headRow);
    const tbody = make('tbody');
    rows.forEach(cells => {
      const tr = make('tr');
      cells.forEach((cell, i) => {
        const td = make('td', '', cell);
        td.dataset.label = headers[i];
        tr.append(td);
      });
      tbody.append(tr);
    });
    t.append(thead, tbody);
    const wrap = make('div', 'sheet-table-wrap');
    wrap.append(t);
    return wrap;
  }

  function block(title, id, body) {
    const section = make('div', 'sheet-block');
    const heading = make('h2', 'sheet-heading');
    heading.append(id ? jumpLink(id, title) : title);
    section.append(heading, body);
    return section;
  }

  // Splits on commas and "or" outside parentheses, so "(a, b)" stays one item.
  function splitScope(sentence) {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const ch of sentence) {
      if (ch === '(') depth += 1;
      if (ch === ')') depth -= 1;
      if ((ch === ',' || ch === ';') && depth === 0) { parts.push(current); current = ''; } else current += ch;
    }
    parts.push(current);
    return parts.map(p => p.replace(/^\s*(or|and)\s+/i, '').trim()).filter(Boolean);
  }

  function outOfScope() {
    const callout = all(document, '#step1-requirements .callout').find(c => /What NOT to build/i.test(c.textContent));
    if (!callout) return [];
    const body = text(callout).replace(/^What NOT to build:?\s*/i, '');
    const first = body.split(/\.\s/)[0].replace(/\.$/, '');
    return splitScope(first);
  }

  function requirements() {
    const cards = all(document, '#step1-requirements .compare-card');
    const items = (label) => {
      const card = cards.find(c => text(c.querySelector('.compare-label')).startsWith(label));
      return card ? all(card, 'li').map(text) : [];
    };
    return table(['Functional', 'Non-functional', 'Out of scope'],
      [[list(items('Functional'), true), list(items('Non-Functional'), true), list(outOfScope(), true)]]);
  }

  function numbers() {
    const stats = all(document, '#step1-requirements .stat-card');
    return table(stats.map(s => text(s.querySelector('.stat-label'))),
      [stats.map(s => make('strong', 'sheet-stat', text(s.querySelector('.stat-val'))))]);
  }

  function entities() {
    return table(['Entity', 'Store', 'Key fields', 'Why'], all(document, '#step2-entities .entity-box').map(box => [
      make('strong', '', text(box.querySelector('.entity-name'))),
      text(box.querySelector('.entity-store')),
      all(box, '.fname').map(text).join(', '),
      text(box.querySelector('.entity-why')).split(/(?<=\.)\s/)[0],
    ]));
  }

  function api() {
    return table(['Method', 'Path', 'Sends', 'Returns'], all(document, '#step3-api .api-card').map(card => {
      const bodies = all(card, '.api-io-body').map(text);
      return [
        make('span', 'sheet-method', text(card.querySelector('.api-method'))),
        make('code', '', text(card.querySelector('.api-path'))),
        bodies[0] || '—',
        bodies[1] || '—',
      ];
    }));
  }

  function splitStep(li) {
    const lead = text(li.querySelector('span'));
    return [lead, text(li).slice(lead.length).replace(/^\s*[—-]\s*/, '')];
  }

  function dataFlow() {
    const steps = all(document, '#step4-dataflow .flow-steps-list li');
    return table(['Step', 'What happens', 'Detail'], steps.map((li, i) => {
      const [lead, detail] = splitStep(li);
      return [make('span', 'sheet-num', String(i + 1)), make('strong', '', lead), detail];
    }));
  }

  function designLabels(svg) {
    const seen = new Set();
    return all(svg, '.diag-label')
      .map(el => ({ label: text(el), x: Number(el.getAttribute('x')) || 0, y: Number(el.getAttribute('y')) || 0 }))
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .filter(({ label }) => label && !seen.has(label) && seen.add(label))
      .map(({ label }) => label);
  }

  function design(svg) {
    const link = make('a', 'sheet-diagram');
    link.href = '#step5-hld';
    const img = make('img');
    img.src = `${root}assets/thumbs/${slug}.svg`;
    img.alt = `High-level design: ${designLabels(svg).join(', ')}`;
    const box = svg.viewBox.baseVal;
    img.width = box.width;
    img.height = box.height;
    link.append(img);
    return link;
  }

  function deepDives() {
    return table(['Deep dive', 'How it works'], all(document, 'main > section[id^="step6-deepdive"]').map(sec => {
      const name = text(sec.querySelector(':scope > h2')).replace(/^Deep dive:\s*/i, '');
      const steps = all(sec, '.flow-steps-list li').map(li => splitStep(li)[0]);
      const prose = text(sec.querySelector('.sec-body > p, .callout'));
      const heads = all(sec, '.grid-table th').map(text);
      const fallback = prose || (heads.length ? `Compare by ${heads.join(', ').toLowerCase()} in the full breakdown.` : 'See the full breakdown.');
      return [jumpLink(sec.id, name), steps.length ? list(steps, true) : fallback];
    }));
  }

  function breaksWhen() {
    const source = all(document, 'main .grid-table').find(t => /bottleneck/i.test(text(t.querySelector('th'))));
    if (!source) return null;
    return table(all(source, 'th').map(text), all(source, 'tbody tr').map(tr =>
      all(tr, 'td').map(td => text(td).replace(/^TRIGGERS AT\s*/, ''))));
  }

  function probes() {
    return table(['If they ask', 'Answer'], all(document, '#follow-ups .qa-block').slice(0, MAX_PROBES).map(qa => [
      make('strong', '', text(qa.querySelector('.qa-q'))), text(qa.querySelector('.qa-a')),
    ]));
  }

  function summary(svg) {
    const box = make('div', 'sheet-summary');
    const first = text(document.querySelector('.flash-card li')).replace(/^The core insight:\s*/i, '');
    const oneLine = make('p');
    oneLine.append(make('strong', '', 'In one line: '), first);
    const draw = make('div', 'sheet-draw');
    draw.append(make('strong', '', 'Draw these: '));
    designLabels(svg).forEach(label => draw.append(make('span', 'sheet-chip', label)));
    box.append(oneLine, draw);
    return box;
  }

  function buildSheet() {
    // The section also holds small icon SVGs, so pick the one with component labels.
    const svg = all(document, '#step5-hld svg').find(el => el.querySelector('.diag-label'));
    const sheet = make('div', 'sheet');
    sheet.id = 'interview-sheet';
    sheet.append(
      summary(svg),
      block('Requirements', 'step1-requirements', requirements()),
      block('Numbers', '', numbers()),
      block('Core entities', 'step2-entities', entities()),
      block('API', 'step3-api', api()),
      block('Data flow', 'step4-dataflow', dataFlow()),
      block('High-level design', 'step5-hld', design(svg)),
      block('Deep dives', '', deepDives()),
    );
    const breaks = breaksWhen();
    if (breaks) sheet.append(block('Breaks when', '', breaks));
    sheet.append(block('Likely probes', 'follow-ups', probes()));
    return sheet;
  }

  function buildTabs(setView) {
    const tabs = make('div', 'view-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Page view');
    const add = (view, label) => {
      const btn = make('button', '', label);
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.dataset.view = view;
      btn.addEventListener('click', () => {
        history.replaceState(null, '', location.pathname + location.search);
        setView(view);
        tabs.scrollIntoView({ block: 'start' });
      });
      tabs.append(btn);
    };
    add('sheet', 'One-page sheet');
    add('full', 'Full breakdown');
    const print = make('button', 'view-print', 'Print sheet');
    print.type = 'button';
    print.addEventListener('click', () => {
      setView('sheet');
      window.print();
    });
    tabs.append(print);
    return tabs;
  }

  function init() {
    const head = main.querySelector('.page-head');
    const setView = (view) => {
      main.classList.toggle('view-sheet', view === 'sheet');
      main.classList.toggle('view-full', view === 'full');
      all(main, '.view-tabs [role="tab"]').forEach(btn => btn.setAttribute('aria-selected', String(btn.dataset.view === view)));
    };
    const sheet = buildSheet();
    const tabs = buildTabs(setView);
    head.after(tabs, sheet);

    // Any section link needs the full breakdown, because that is where the target lives.
    const followHash = () => {
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!target) return;
      setView('full');
      target.classList.remove('collapsed');
      target.scrollIntoView();
    };
    setView(location.hash ? 'full' : 'sheet');
    followHash();
    window.addEventListener('hashchange', followHash);
  }

  init();
})();
