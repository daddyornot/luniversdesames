export interface RegisterRequest {
  email: string;
  password?: string; // Optionnel car géré par le formulaire
  firstName: string;
  lastName: string;
}
