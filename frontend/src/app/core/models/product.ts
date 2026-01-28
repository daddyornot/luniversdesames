import { Stone } from './stone';

export type ProductType = 'PHYSICAL' | 'ENERGY_CARE' | 'CARD_READING' | 'COACHING' | 'SUBSCRIPTION';

export interface ProductVariant {
  id?: number;
  label: string;
  price: number;
  sessionCount?: number;
  durationMonths?: number;
}

export interface ProductSize {
  id: number;
  label: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stones: Stone[];
  imageUrl: string;
  type: ProductType;
  sessionCount?: number;
  durationMonths?: number;
  variants?: ProductVariant[];
  sizes?: ProductSize[];
  bufferTimeMinutes?: number;
  isSubscription?: boolean;
  recurringInterval?: string;
}
