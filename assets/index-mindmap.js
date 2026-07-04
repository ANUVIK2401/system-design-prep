/* ── Index page mindmap: 6 category nodes, expand-on-click to show topics ── */
(function () {
  const DATA = {
    center: 'System Design',
    categories: [
      { id: 'foundations', label: 'Foundations', topics: [
        { label: 'Introduction', href: 'topics/sd-introduction.html' },
        { label: 'How to Prepare', href: 'topics/how-to-prepare.html' },
        { label: 'Delivery Framework', href: 'topics/delivery-framework.html' },
        { label: 'Core Concepts', href: 'topics/core-concepts.html' },
        { label: 'Key Technologies', href: 'topics/key-technologies.html' },
        { label: 'Common Patterns', href: 'topics/common-patterns.html' },
      ] },
      { id: 'patterns', label: 'Patterns', topics: [
        { label: 'Real-Time Updates', href: 'topics/patterns/real-time-updates.html' },
        { label: 'Contention', href: 'topics/patterns/dealing-with-contention.html' },
        { label: 'Multi-Step Processes', href: 'topics/patterns/multi-step-processes.html' },
        { label: 'Scaling Reads', href: 'topics/patterns/scaling-reads.html' },
        { label: 'Scaling Writes', href: 'topics/patterns/scaling-writes.html' },
        { label: 'Large Blobs', href: 'topics/patterns/handling-large-blobs.html' },
        { label: 'Long-Running Processes', href: 'topics/patterns/managing-long-running-processes.html' },
      ] },
      { id: 'tech', label: 'Key Technologies', topics: [
        { label: 'Redis', href: 'topics/tech/redis.html' },
        { label: 'Elasticsearch', href: 'topics/tech/elasticsearch.html' },
        { label: 'Kafka', href: 'topics/tech/kafka.html' },
        { label: 'API Gateway', href: 'topics/tech/api-gateway.html' },
        { label: 'Cassandra', href: 'topics/tech/cassandra.html' },
        { label: 'DynamoDB', href: 'topics/tech/dynamodb.html' },
        { label: 'PostgreSQL', href: 'topics/tech/postgresql.html' },
        { label: 'Flink', href: 'topics/tech/flink.html' },
        { label: 'ZooKeeper', href: 'topics/tech/zookeeper.html' },
      ] },
      { id: 'advanced', label: 'Advanced Topics', topics: [
        { label: 'Proximity Search', href: 'topics/advanced/proximity-search.html' },
        { label: 'Big Data Structures', href: 'topics/advanced/data-structures-big-data.html' },
        { label: 'Vector Databases', href: 'topics/advanced/vector-databases.html' },
        { label: 'Time-Series DBs', href: 'topics/advanced/time-series-databases.html' },
      ] },
      { id: 'questions-easy', label: 'Questions (Easy)', topics: [
        { label: 'URL Shortener', href: 'topics/questions/url-shortener.html' },
        { label: 'LeetCode', href: 'topics/questions/leetcode.html' },
        { label: 'Yelp', href: 'topics/questions/yelp.html' },
        { label: 'Strava', href: 'topics/questions/strava.html' },
        { label: 'Rate Limiter', href: 'topics/questions/rate-limiter.html' },
        { label: 'FB Post Search', href: 'topics/questions/fb-post-search.html' },
        { label: 'Price Tracking', href: 'topics/questions/price-tracking.html' },
        { label: 'News Aggregator', href: 'topics/questions/news-aggregator.html' },
      ] },
      { id: 'questions-hard', label: 'Questions (Hard)', topics: [
        { label: 'Bitly', href: 'topics/questions/bitly.html' },
        { label: 'Dropbox', href: 'topics/questions/dropbox.html' },
        { label: 'Local Delivery', href: 'topics/questions/local-delivery.html' },
        { label: 'Ticketmaster', href: 'topics/questions/ticketmaster.html' },
        { label: 'FB News Feed', href: 'topics/questions/fb-news-feed.html' },
        { label: 'Tinder', href: 'topics/questions/tinder.html' },
        { label: 'WhatsApp', href: 'topics/questions/whatsapp.html' },
        { label: 'Online Auction', href: 'topics/questions/online-auction.html' },
        { label: 'FB Live Comments', href: 'topics/questions/fb-live-comments.html' },
        { label: 'Online Chess', href: 'topics/questions/online-chess.html' },
        { label: 'Instagram', href: 'topics/questions/instagram.html' },
        { label: 'YouTube Top-K', href: 'topics/questions/youtube-top-k.html' },
        { label: 'Uber', href: 'topics/questions/uber.html' },
        { label: 'Robinhood', href: 'topics/questions/robinhood.html' },
        { label: 'Google Docs', href: 'topics/questions/google-docs.html' },
        { label: 'Distributed Cache', href: 'topics/questions/distributed-cache.html' },
        { label: 'Job Scheduler', href: 'topics/questions/job-scheduler.html' },
        { label: 'Web Crawler', href: 'topics/questions/web-crawler.html' },
        { label: 'Ad Click Aggregator', href: 'topics/questions/ad-click-aggregator.html' },
        { label: 'Payment System', href: 'topics/questions/payment-system.html' },
        { label: 'Metrics Monitoring', href: 'topics/questions/metrics-monitoring.html' },
        { label: 'ChatGPT', href: 'topics/questions/chatgpt.html' },
      ] },
    ],
  };

  const VIEW_KEY = 'sdprep-index-view';

  function buildIndexMindmap(container) {
    const W = 1100, H = 600;
    const cx = W / 2, cy = H / 2;
    const r1 = 190;
    const n = DATA.categories.length;

    const catNodes = DATA.categories.map((cat, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { ...cat, x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle), angle };
    });

    function curvePath(ax, ay, bx, by) {
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      const dx = bx - ax, dy = by - ay;
      const nx = -dy, ny = dx;
      const len = Math.hypot(nx, ny) || 1;
      const bend = 18;
      return `M${ax},${ay} Q${mx + (nx / len) * bend},${my + (ny / len) * bend} ${bx},${by}`;
    }

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="index-mm-svg">`;
    svg += `<g class="index-mm-links">`;
    catNodes.forEach(cat => {
      svg += `<path class="index-mm-link" data-cat="${cat.id}" d="${curvePath(cx, cy, cat.x, cat.y)}" fill="none"/>`;
    });
    svg += `</g>`;

    svg += `<g class="index-mm-center" transform="translate(${cx},${cy})"><circle r="52"></circle><text class="index-mm-center-label" dy="0.35em">${DATA.center}</text></g>`;

    svg += `<g class="index-mm-cats">`;
    catNodes.forEach(cat => {
      svg += `<g class="index-mm-cat" data-cat="${cat.id}" transform="translate(${cat.x},${cat.y})" tabindex="0" role="button" aria-expanded="false">
        <circle r="38"></circle>
        <text class="index-mm-cat-label" dy="0.35em">${wrapCatLabel(cat.label)}</text>
      </g>`;
    });
    svg += `</g>`;
    svg += `<g class="index-mm-topics"></g>`;
    svg += `</svg>`;

    container.innerHTML = svg;
    wireIndexMindmap(container, catNodes, curvePath, cx, cy);
  }

  function wrapCatLabel(label) {
    if (label.length <= 10) return escapeAttr(label);
    const words = label.split(' ');
    const mid = Math.ceil(words.length / 2);
    const l1 = words.slice(0, mid).join(' ');
    const l2 = words.slice(mid).join(' ');
    return `<tspan x="0" dy="-0.4em">${escapeAttr(l1)}</tspan><tspan x="0" dy="1.1em">${escapeAttr(l2)}</tspan>`;
  }
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function wireIndexMindmap(container, catNodes, curvePath, cx, cy) {
    const svg = container.querySelector('.index-mm-svg');
    const topicsLayer = svg.querySelector('.index-mm-topics');
    let expandedCat = null;

    svg.querySelectorAll('.index-mm-cat').forEach(catEl => {
      const catId = catEl.dataset.cat;
      const cat = catNodes.find(c => c.id === catId);

      function toggle() {
        if (expandedCat === catId) {
          topicsLayer.innerHTML = '';
          catEl.setAttribute('aria-expanded', 'false');
          svg.querySelectorAll('.index-mm-cat').forEach(c => c.classList.remove('cat-dim'));
          expandedCat = null;
          return;
        }
        expandedCat = catId;
        svg.querySelectorAll('.index-mm-cat').forEach(c => c.classList.toggle('cat-dim', c.dataset.cat !== catId));
        svg.querySelectorAll('.index-mm-cat').forEach(c => c.setAttribute('aria-expanded', String(c.dataset.cat === catId)));

        const topics = cat.topics;
        const spreadAngle = Math.min(Math.PI * 0.7, 0.24 * topics.length);
        const r2 = 130;
        let html = '';
        topics.forEach((t, i) => {
          const count = topics.length;
          const off = count === 1 ? 0 : (i / (count - 1) - 0.5) * spreadAngle;
          const a = cat.angle + off;
          const tx = cat.x + r2 * Math.cos(a);
          const ty = cat.y + r2 * Math.sin(a);
          const delay = i * 50;
          html += `<path class="index-mm-topic-link" style="transition-delay:${delay}ms" d="${curvePath(cat.x, cat.y, tx, ty)}" fill="none"></path>`;
          html += `<a class="index-mm-topic" href="${t.href}" style="transition-delay:${delay}ms" transform="translate(${tx},${ty})">
            <circle r="24"></circle>
            <text class="index-mm-topic-label" dy="0.35em">${wrapCatLabel(t.label)}</text>
          </a>`;
        });
        topicsLayer.innerHTML = html;
        requestAnimationFrame(() => {
          topicsLayer.querySelectorAll('.index-mm-topic, .index-mm-topic-link').forEach(el => el.classList.add('topic-in'));
        });
      }

      catEl.addEventListener('click', toggle);
      catEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') toggle(); });
    });

    // Touch pan for iPad.
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

  function initViewToggle() {
    const toggle = document.getElementById('viewToggle');
    const mapView = document.getElementById('indexMapView');
    const grid = document.getElementById('topicGrid');
    const mindmapWrap = document.getElementById('indexMindmapWrap');
    if (!toggle || !mapView || !grid || !mindmapWrap) return;

    let built = false;
    function showView(view) {
      const isMap = view === 'map';
      mapView.hidden = !isMap;
      grid.style.display = isMap ? 'none' : '';
      document.querySelector('.filter-row .filter-btn.active')?.classList.toggle('view-hidden-hint', isMap);
      toggle.querySelectorAll('.view-toggle-btn').forEach(btn => {
        const active = btn.dataset.view === view;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      if (isMap && !built) {
        buildIndexMindmap(mindmapWrap);
        built = true;
      }
      try { sessionStorage.setItem(VIEW_KEY, view); } catch (e) {}
    }

    toggle.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => showView(btn.dataset.view));
    });

    let saved = 'grid';
    try { saved = sessionStorage.getItem(VIEW_KEY) || 'grid'; } catch (e) {}
    showView(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewToggle);
  } else {
    initViewToggle();
  }
})();
