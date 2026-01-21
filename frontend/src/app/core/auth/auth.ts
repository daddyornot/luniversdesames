import {computed, inject, Injectable, signal} from '@angular/core';
import {tap} from 'rxjs';
import {User} from '../models/user';
import {AuthResponse} from '../models/auth-response';
import {RegisterRequest} from '../models/register-request';
import {LocalStorageService} from '../local-storage/local-storage';
import {ApiService} from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private localStorage = inject(LocalStorageService);

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('auth/login', {email, password})
      .pipe(
        tap(res => {
          this.localStorage.setItem('token', res.token);
          const user: User = {email: res.email, firstName: res.firstName, lastName: res.lastName};
          this.localStorage.setItem('user', user);
          this.currentUser.set(user);
        })
      );
  }

  register(userData: RegisterRequest) {
    return this.api.post('auth/register', userData);
  }

  logout() {
    this.localStorage.removeItem('token');
    this.localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  private getUserFromStorage(): User | null {
    const storedUser = this.localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      this.localStorage.removeItem('user');
      return null;
    }
  }
}
