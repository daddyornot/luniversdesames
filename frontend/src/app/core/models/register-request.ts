export interface RegisterRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}
