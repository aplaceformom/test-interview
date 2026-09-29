'use strict';

/**
 * Fixture feed for local development.
 *
 * Two upstream sources are stitched together here, the same way they are in
 * the real inventory service:
 *
 *   - "partner"  — the current partner API (ISO 8601 timestamps)
 *   - "legacy"   — the 2014 inventory import that is still not migrated
 *
 * Timestamps are generated relative to process start so the fixture never
 * goes stale.
 */

const MINUTE = 60 * 1000;

const COMMUNITIES = [
  { id: 1,  source: 'partner', name: 'Cedar Grove Senior Living',   city: 'San Antonio',   state: 'TX', careType: 'Assisted Living',  monthlyRateCents: 428000, availableUnits: 4,  agedMinutes: 12 },
  { id: 2,  source: 'partner', name: 'Harbor Point Memory Care',    city: 'San Diego',     state: 'CA', careType: 'Memory Care',      monthlyRateCents: 689500, availableUnits: 1,  agedMinutes: 47 },
  { id: 3,  source: 'legacy',  name: 'The Willows at Santa Rosa',   city: 'Santa Rosa',    state: 'CA', careType: 'Assisted Living',  monthlyRateCents: 512000, availableUnits: 0,  agedMinutes: 133 },
  { id: 4,  source: 'partner', name: 'Magnolia Court',              city: 'Santa Fe',      state: 'NM', careType: 'Independent',      monthlyRateCents: 315000, availableUnits: 9,  agedMinutes: 6 },
  { id: 5,  source: 'legacy',  name: 'Riverbend Commons',           city: 'Santa Clara',   state: 'CA', careType: 'Assisted Living',  monthlyRateCents: 604000, availableUnits: 2,  agedMinutes: 260 },
  { id: 6,  source: 'partner', name: 'Oakhaven Residences',         city: 'Sacramento',    state: 'CA', careType: 'Memory Care',      monthlyRateCents: 573000, availableUnits: 3,  agedMinutes: 22 },
  { id: 7,  source: 'partner', name: 'Pinecrest Manor',             city: 'Salem',         state: 'OR', careType: 'Independent',      monthlyRateCents: 289000, availableUnits: 11, agedMinutes: 91 },
  { id: 8,  source: 'legacy',  name: 'Bayside Terrace',             city: 'San Mateo',     state: 'CA', careType: 'Assisted Living',  monthlyRateCents: 731000, availableUnits: 1,  agedMinutes: 18 },
  { id: 9,  source: 'partner', name: 'Kestrel Ridge',               city: 'Santa Barbara', state: 'CA', careType: 'Memory Care',      monthlyRateCents: 812000, availableUnits: 0,  agedMinutes: 4 },
  { id: 10, source: 'partner', name: 'Alder House',                 city: 'Portland',      state: 'OR', careType: 'Assisted Living',  monthlyRateCents: 398000, availableUnits: 6,  agedMinutes: 55 },
  { id: 11, source: 'partner', name: 'Copperfield Gardens',         city: 'Austin',        state: 'TX', careType: 'Independent',      monthlyRateCents: 342000, availableUnits: 7,  agedMinutes: 39 },
  { id: 12, source: 'legacy',  name: 'Lakeview Springs',            city: 'Sandy Springs', state: 'GA', careType: 'Assisted Living',  monthlyRateCents: 455000, availableUnits: 5,  agedMinutes: 205 },
];

function build() {
  const now = Date.now();

  return {
    communities: COMMUNITIES.map((c) => {
      const updated = now - c.agedMinutes * MINUTE;
      const { agedMinutes, source, ...rest } = c;

      return {
        ...rest,
        source,
        // The partner API sends ISO 8601. The legacy import has always sent a
        // unix timestamp; nobody has had the appetite to change it.
        updatedAt: source === 'legacy'
          ? Math.floor(updated / 1000)
          : new Date(updated).toISOString(),
      };
    }),
  };
}

module.exports = { build };
