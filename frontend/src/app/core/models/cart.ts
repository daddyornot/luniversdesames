import { ProductDTO, ProductSizeDTO, ProductVariantDTO } from '../api';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    type: ProductDTO.TypeEnum;
    selectedVariant?: ProductVariantDTO;
    appointmentDate?: string;
    selectedSize?: ProductSizeDTO;
}
