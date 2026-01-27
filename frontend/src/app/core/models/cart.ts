import {ProductSize, ProductType, ProductVariant} from './product';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  type: ProductType;
  selectedVariant?: ProductVariant;
  appointmentDate?: string;
  selectedSize?: ProductSize;
}
