import type { Timestamp } from './format';

export interface Community {
  id: number;
  source: 'partner' | 'legacy';
  name: string;
  city: string;
  state: string;
  careType: string;
  monthlyRateCents: number;
  availableUnits: number;
  updatedAt: Timestamp;
}
