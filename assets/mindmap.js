/* ── Concept Map (mindmap) renderer ──
   Pure SVG + JS radial diagram. Renders into any element with
   [data-mindmap] from a JSON blob in that same element's
   data-mindmap-json attribute. No external libraries.

   Data shape:
   {
     center: "Topic Name",
     ring1: [
       { label, def, target, ring2: [{ label, def }, ...] },
       ...
     ]
   }
   - target (optional): a section id on the current page to scroll to on click.
*/
(function () {
  function buildMindmap(container, data) {
    const W = 720, H = 560;
    const cx = W / 2, cy = H / 2;
    const r1 = Math.min(W, H) * 0.28;   // ring 1 radius
    const r2 = Math.min(W, H) * 0.46;   // ring 2 radius
    const n1 = data.ring1.length;

    const nodes = [];
    nodes.push({ id: 'center', x: cx, y: cy, r: 40, label: data.center, kind: 'center' });

    data.ring1.forEach((node, i) => {
      const angle = (i / n1) * Math.PI * 2 - Math.PI / 2;
      const x = cx + r1 * Math.cos(angle);
      const y = cy + r1 * Math.sin(angle);
      const id = 'r1-' + i;
      nodes.push({ id, x, y, r: 30, label: node.label, def: node.def, target: node.target, kind: 'ring1', parent: 'center' });

      const sub = node.ring2 || [];
      const spread = Math.min(Math.PI / n1 * 0.85, 0.62);
      sub.forEach((s, j) => {
        const sCount = sub.length;
        const off = sCount === 1 ? 0 : (j / (sCount - 1) - 0.5) * spread;
        const sAngle = angle + off;
        const sx = cx + r2 * Math.cos(sAngle);
        const sy = cy + r2 * Math.sin(sAngle);
        nodes.push({ id: id + '-' + j, x: sx, y: sy, r: 22, label: s.label, def: s.def, kind: 'ring2', parent: id });
      });
    });

    const byId = {};
    nodes.forEach(n => byId[n.id] = n);

    function curvePath(a, b) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y;
      const nx = -dy, ny = dx;
      const len = Math.hypot(nx, ny) || 1;
      const bend = 14;
      const cxp = mx + (nx / len) * bend;
      const cyp = my + (ny / len) * bend;
      return `M${a.x},${a.y} Q${cxp},${cyp} ${b.x},${b.y}`;
    }

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="mindmap-svg">`;
    svg += `<g class="mm-links">`;
    nodes.forEach(n => {
      if (!n.parent) return;
      const p = byId[n.parent];
      svg += `<path class="mm-link" data-from="${n.parent}" data-to="${n.id}" d="${curvePath(p, n)}" fill="none"/>`;
    });
    svg += `</g>`;

    svg += `<g class="mm-nodes">`;
    nodes.forEach(n => {
      const cls = ['mm-node', 'mm-' + n.kind].join(' ');
      const clickable = n.kind === 'ring1' && n.target;
      svg += `<g class="${cls}" data-id="${n.id}" data-parent="${n.parent || ''}" ${n.def ? `data-tip="${escapeAttr(n.def)}"` : ''} ${clickable ? `data-target="${n.target}" tabindex="0" role="button"` : ''} transform="translate(${n.x},${n.y})">
        <circle r="${n.r}"></circle>
        <text class="mm-label" dy="0.35em">${wrapLabel(n.label, n.kind)}</text>
      </g>`;
    });
    svg += `</g></svg>`;

    container.innerHTML = svg;
    wireInteractions(container);
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  // Break long labels onto 2 tspan lines for ring1/ring2 nodes.
  function wrapLabel(label, kind) {
    const maxChars = kind === 'center' ? 14 : (kind === 'ring1' ? 11 : 10);
    if (label.length <= maxChars) return escapeAttr(label);
    const words = label.split(' ');
    let l1 = '', l2 = '';
    words.forEach(w => {
      if ((l1 + ' ' + w).trim().length <= maxChars && !l2) l1 = (l1 + ' ' + w).trim();
      else l2 = (l2 + ' ' + w).trim();
    });
    if (!l2) return escapeAttr(l1);
    return `<tspan x="0" dy="-0.5em">${escapeAttr(l1)}</tspan><tspan x="0" dy="1.1em">${escapeAttr(l2)}</tspan>`;
  }

  function wireInteractions(container) {
    const svg = container.querySelector('.mindmap-svg');
    if (!svg) return;
    const tip = document.createElement('div');
    tip.className = 'mm-tip';
    container.appendChild(tip);

    const nodesEls = svg.querySelectorAll('.mm-node');
    const linksEls = svg.querySelectorAll('.mm-link');

    function highlight(id, on) {
      const links = svg.querySelectorAll(`.mm-link[data-from="${id}"], .mm-link[data-to="${id}"]`);
      links.forEach(l => l.classList.toggle('mm-link-active', on));
    }

    nodesEls.forEach(node => {
      const id = node.dataset.id;
      node.addEventListener('mouseenter', (e) => {
        node.classList.add('mm-hover');
        highlight(id, true);
        const parentId = node.dataset.parent;
        if (parentId) highlight(parentId, true);
        const def = node.getAttribute('data-tip');
        if (def) {
          tip.textContent = def;
          const rect = node.getBoundingClientRect();
          const wrapRect = container.getBoundingClientRect();
          tip.style.left = (rect.left - wrapRect.left + rect.width / 2) + 'px';
          tip.style.top = (rect.top - wrapRect.top) + 'px';
          tip.classList.add('show');
        }
      });
      node.addEventListener('mouseleave', () => {
        node.classList.remove('mm-hover');
        highlight(id, false);
        const parentId = node.dataset.parent;
        if (parentId) highlight(parentId, false);
        tip.classList.remove('show');
      });
      const targetId = node.dataset.target;
      if (targetId) {
        node.style.cursor = 'pointer';
        const go = () => {
          const target = document.getElementById(targetId);
          if (!target) return;
          target.classList.remove('collapsed');
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          target.style.transition = 'box-shadow 0.3s ease';
          target.style.boxShadow = '0 0 0 2px var(--accent)';
          target.style.borderRadius = '8px';
          setTimeout(() => { target.style.boxShadow = 'none'; }, 1400);
        };
        node.addEventListener('click', go);
        node.addEventListener('keypress', (e) => { if (e.key === 'Enter') go(); });
      }
    });

    // Touch/iPad pan support (simple drag-to-scroll within the wrap).
    let isDown = false, startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;
    container.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      isDown = true; startX = t.clientX; startY = t.clientY;
      scrollLeft = container.scrollLeft; scrollTop = container.scrollTop;
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const t = e.touches[0];
      container.scrollLeft = scrollLeft - (t.clientX - startX);
      container.scrollTop = scrollTop - (t.clientY - startY);
    }, { passive: true });
    container.addEventListener('touchend', () => { isDown = false; });
  }

  // ── Collapsible "Concept Map" section wiring: starts collapsed on every page ──
  function initConceptMapSections() {
    document.querySelectorAll('[data-mindmap]').forEach(el => {
      let data;
      try { data = JSON.parse(el.dataset.mindmap); } catch (e) { return; }
      buildMindmap(el, data);
    });

    document.querySelectorAll('.concept-map-section').forEach(sec => {
      const head = sec.querySelector('.concept-map-head');
      if (!head) return;
      sec.classList.add('cm-collapsed');
      head.addEventListener('click', () => sec.classList.toggle('cm-collapsed'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConceptMapSections);
  } else {
    initConceptMapSections();
  }

  window.SDMindmap = { buildMindmap };
})();
