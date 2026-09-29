import express from 'express';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { Board } from './Board';
import type { Community } from '../shared/types';

const PORT = Number(process.env.PORT || 3010);
const API = process.env.API_URL || 'http://localhost:4010';

const app = express();

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

/** Same-origin passthrough to the mock inventory API. */
app.use('/api', async (req, res) => {
  try {
    const upstream = await fetch(`${API}${req.url}`);
    res.status(upstream.status).json(await upstream.json());
  } catch (err) {
    res.status(502).json({ error: String(err) });
  }
});

app.get('/', async (_req, res) => {
  const upstream = await fetch(`${API}/communities`);
  const communities = (await upstream.json()) as Community[];

  const html = renderToString(<Board communities={communities} />);

  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Availability board</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
${html}
<script src="/js/module-registry.js"></script>
<script src="/js/board.js"></script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`[web] http://localhost:${PORT}`);
});
