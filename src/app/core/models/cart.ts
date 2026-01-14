export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'bracelet' | 'session'; // Pour différencier tes produits
}
