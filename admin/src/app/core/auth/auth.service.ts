import {inject, Injectable, isDevMode, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = isDevMode() ? 'http://localhost:8080/api/auth' : '/api/auth';

  currentUser = signal<any>(this.getUserFromStorage());

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {email, password}).pipe(
      tap(res => {
        localStorage.setItem('admin_token', res.token);
        const user = {email: res.email, firstName: res.firstName, lastName: res.lastName};
        localStorage.setItem('admin_user', JSON.stringify(user));
        this.currentUser.set(user);
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('admin_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }
}
