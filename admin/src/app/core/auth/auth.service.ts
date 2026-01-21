import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  currentUser = signal<any>(this.getUserFromStorage());

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {email, password}).pipe(
      tap(res => {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify({email: res.email, firstName: res.firstName}));
        this.currentUser.set({email: res.email, firstName: res.firstName});
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
