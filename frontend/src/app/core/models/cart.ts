export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'bracelet' | 'session';
  appointmentDate?: string; // Nouveau : Date ISO du RDV (ex: 2024-05-20T14:00:00)
}
