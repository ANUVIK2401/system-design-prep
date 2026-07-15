# System Design Prep

### **[→ Open the live site](https://anuvik2401.github.io/system-design-prep/)**

A self-contained system design interview prep site — no fluff, no theory for theory's sake. 57 pages: 6 foundation pages, 7 core patterns, 9 key technologies, 4 advanced topics, and 30 full question breakdowns (Uber, WhatsApp, Google Docs, rate limiter, and more), each walked through requirements → entities → API → data flow → high-level design → deep dive, with interview moves you can say out loud.

Static site, vanilla HTML/CSS/JS, zero build step, deployed via GitHub Pages from `main`.

## Contents

### Foundations
Start here, in order.

| Page | What it covers |
|---|---|
| [Introduction](topics/sd-introduction.html) | What system design interviews actually test |
| [How to Prepare](topics/how-to-prepare.html) | Study strategy and timeline |
| [Delivery Framework](topics/delivery-framework.html) | The framework to run in every interview |
| [Core Concepts](topics/core-concepts.html) | CAP theorem, consistency, latency numbers |
| [Key Technologies](topics/key-technologies.html) | When to reach for SQL vs NoSQL, Redis, Kafka, CDN, LB |
| [Common Patterns](topics/common-patterns.html) | Read-heavy, write-heavy, fan-out, saga, CQRS |

### Patterns
Cross-cutting design patterns, not tied to one question.

[Real-Time Updates](topics/patterns/real-time-updates.html) · [Dealing with Contention](topics/patterns/dealing-with-contention.html) · [Multi-Step Processes](topics/patterns/multi-step-processes.html) · [Scaling Reads](topics/patterns/scaling-reads.html) · [Scaling Writes](topics/patterns/scaling-writes.html) · [Handling Large Blobs](topics/patterns/handling-large-blobs.html) · [Long-Running Processes](topics/patterns/managing-long-running-processes.html)

### Key Technologies
[Redis](topics/tech/redis.html) · [Elasticsearch](topics/tech/elasticsearch.html) · [Kafka](topics/tech/kafka.html) · [API Gateway](topics/tech/api-gateway.html) · [Cassandra](topics/tech/cassandra.html) · [DynamoDB](topics/tech/dynamodb.html) · [PostgreSQL](topics/tech/postgresql.html) · [Flink](topics/tech/flink.html) · [ZooKeeper](topics/tech/zookeeper.html)

### Advanced Topics
[Proximity Search](topics/advanced/proximity-search.html) · [Big Data Structures](topics/advanced/data-structures-big-data.html) · [Vector Databases](topics/advanced/vector-databases.html) · [Time-Series Databases](topics/advanced/time-series-databases.html)

### Question Breakdowns
30 full walkthroughs, indexed at [Question Breakdowns](topics/question-breakdowns.html).

<details>
<summary>Show all 30</summary>

[URL Shortener](topics/questions/url-shortener.html) · [Bitly](topics/questions/bitly.html) · [Dropbox](topics/questions/dropbox.html) · [Local Delivery](topics/questions/local-delivery.html) · [News Aggregator](topics/questions/news-aggregator.html) · [Ticketmaster](topics/questions/ticketmaster.html) · [FB News Feed](topics/questions/fb-news-feed.html) · [Tinder](topics/questions/tinder.html) · [LeetCode](topics/questions/leetcode.html) · [WhatsApp](topics/questions/whatsapp.html) · [Yelp](topics/questions/yelp.html) · [Strava](topics/questions/strava.html) · [Rate Limiter](topics/questions/rate-limiter.html) · [Online Auction](topics/questions/online-auction.html) · [FB Live Comments](topics/questions/fb-live-comments.html) · [FB Post Search](topics/questions/fb-post-search.html) · [Price Tracking](topics/questions/price-tracking.html) · [Online Chess](topics/questions/online-chess.html) · [Instagram](topics/questions/instagram.html) · [YouTube Top-K](topics/questions/youtube-top-k.html) · [Uber](topics/questions/uber.html) · [Robinhood](topics/questions/robinhood.html) · [Google Docs](topics/questions/google-docs.html) · [Distributed Cache](topics/questions/distributed-cache.html) · [Job Scheduler](topics/questions/job-scheduler.html) · [Web Crawler](topics/questions/web-crawler.html) · [Ad Click Aggregator](topics/questions/ad-click-aggregator.html) · [Payment System](topics/questions/payment-system.html) · [Metrics Monitoring](topics/questions/metrics-monitoring.html) · [Design ChatGPT](topics/questions/chatgpt.html)

</details>

## Structure

```
index.html          landing page, topic grid, mindmap view
topics/              all content pages, mirrors the sidebar categories above
  patterns/          cross-cutting patterns
  tech/              key technologies
  advanced/          advanced topics
  questions/         30 question breakdowns
assets/
  style.css          shared styles, design tokens
  nav.js             sidebar, progress tracking, diagrams, step tracker
  mindmap.js         per-page concept map renderer
  index-mindmap.js   index page concept map renderer
```

`assets/nav.js` owns a `TOPICS` array that is the single source of truth for the sidebar — every page above is generated from it and kept in sync with the files on disk.
