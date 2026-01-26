import {ProductVariant} from './product-variant';

export type ProductType = 'PHYSICAL' | 'ENERGY_CARE' | 'CARD_READING' | 'COACHING' | 'SUBSCRIPTION';

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
  stones: string[];
  imageUrl: string;
  type: ProductType
  sessionCount?: number;
  durationMonths?: number;
  variants?: ProductVariant[];
  sizes?: ProductSize[];
  bufferTimeMinutes?: number;
}
