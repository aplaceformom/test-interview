import { formatAvailability, formatRate, formatRelative } from '../shared/format';
import type { Community } from '../shared/types';

/**
 * Server-side only. React is a template engine in this app — there is no
 * hydration, so no hooks, no handlers, no browser APIs in here.
 */
export function CommunityCard({ community }: Readonly<{ community: Community }>) {
  const updatedLabel = formatRelative(community.updatedAt);

  return (
    <li className="card" data-community-id={community.id}>
      <div className="card__head">
        <h2 className="card__name">{community.name}</h2>
        <span className="card__rate">{formatRate(community.monthlyRateCents)}</span>
      </div>
      <p className="card__meta">
        {community.city}, {community.state} · {community.careType}
      </p>
      <p className={community.availableUnits === 0 ? 'card__avail card__avail--none' : 'card__avail'}>
        {formatAvailability(community.availableUnits)}
      </p>
      <p className="card__updated">
        Updated{' '}
        <time className="js-updated" data-updated={updatedLabel}>
          {updatedLabel}
        </time>
      </p>
    </li>
  );
}
