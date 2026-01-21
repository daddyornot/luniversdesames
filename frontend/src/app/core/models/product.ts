export type ProductType = 'PHYSICAL' | 'ENERGY_CARE' | 'CARD_READING' | 'COACHING';

export interface ProductVariant {
  id: number;
  label: string;
  price: number;
  sessionCount: number;
  durationMonths: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stone: string;
  type: ProductType;
  imageUrl: string;
  sessionCount?: number;
  durationMonths?: number;
  variants?: ProductVariant[]; // Liste des variantes
  bufferTimeMinutes?: number; // Temps de buffer en minutes
}
