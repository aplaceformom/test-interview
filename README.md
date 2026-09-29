# Availability board

A small server-rendered page that lists senior-living communities with their
current rate and availability, backed by a mocked inventory API.

## How it is put together

- **`api/`** — a `json-server` instance standing in for the inventory API,
  including a rough simulation of the real service's latency profile.
- **`src/server/`** — Express plus React used as a **server-side template
  engine**. `renderToString` runs once per request and the HTML is sent as-is.
  There is no hydration and no React in the browser.
- **`src/shared/`** — the formatters used to render a community.
- **`public/js/`** — plain client-side JavaScript. A tiny module registry
  hands each server-rendered root to its client module's `init(root)`.

## Running it

```sh
nvm use          # Node 20+
npm install
npm run dev      # web on :3010, api on :4010
```

Open <http://localhost:3010>.

---