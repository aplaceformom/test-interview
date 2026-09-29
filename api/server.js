'use strict';

const jsonServer = require('json-server');
const feed = require('./feed');

const PORT = process.env.API_PORT || 4010;

const server = jsonServer.create();
const router = jsonServer.router(feed.build());

server.use(jsonServer.defaults({ logger: true }));

/**
 * Local latency simulation.
 *
 * The real search index is slower on short, low-selectivity queries because
 * they miss the term cache and fall through to a scan. Broad queries are the
 * slow ones; narrow queries come back quickly. Roughly reproduced here so we
 * don't only ever develop against a 2ms API.
 */
server.use((req, res, next) => {
  const q = String(req.query.q || '');
  const delay = q.length === 0 ? 60 : Math.max(90, 900 - q.length * 210);
  setTimeout(next, delay);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`[api] mock inventory API on http://localhost:${PORT}`);
});
