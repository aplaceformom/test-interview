import { CommunityCard } from './CommunityCard';
import type { Community } from '../shared/types';

export function Board({ communities }: Readonly<{ communities: Community[] }>) {
  return (
    <main className="board" data-module="board">
      <header className="board__head">
        <h1>Availability board</h1>
        <p className="board__sub">Live inventory from partner communities. Updates every few seconds.</p>
        <label className="board__filter">
          <span>Filter by city or name</span>
          <input
            type="search"
            className="js-filter"
            placeholder="e.g. Santa"
            autoComplete="off"
          />
        </label>
      </header>

      <p className="board__count js-count">{communities.length} communities</p>

      <ul className="board__list js-list">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </ul>
    </main>
  );
}
