import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {User} from '../models/user';
import {AuthResponse} from '../models/auth-response';
import {RegisterRequest} from '../models/register-request';
import {LocalStorageService} from '../local-storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorageService);
  private readonly API_URL = 'http://localhost:8080/api/auth';

  // Signal pour l'utilisateur actuel (persistant au rafraîchissement via localStorage)
  currentUser = signal<User | null>(this.getUserFromStorage());

  // Signal calculé pour savoir si on est connecté
  isAuthenticated = computed(() => !!this.currentUser());

  /**
   * Connexion de l'utilisateur
   */
  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, {email, password})
      .pipe(
        tap(res => {
          this.localStorage.setItem('token', res.token);
          const user: User = {email: res.email, firstName: res.firstName};
          this.localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        })
      );
  }

  /**
   * Inscription d'un nouveau compte
   */
  register(userData: RegisterRequest) {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  /**
   * Déconnexion
   */
  logout() {
    this.localStorage.removeItem('token');
    this.localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  /**
   * Récupère l'utilisateur stocké au démarrage de l'app
   */
  private getUserFromStorage(): User | null {
    const storedUser = this.localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}
