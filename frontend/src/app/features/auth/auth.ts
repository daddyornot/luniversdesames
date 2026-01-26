import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth/auth';
import {ToastService} from '../../services/toast/toast';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  // État local : 'login' ou 'register'
  mode = signal<'login' | 'register'>('login');
  isLoading = signal(false);

  // Modèles de données
  authData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  };

  toggleMode() {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
  }

  onSubmit() {
    this.isLoading.set(true);

    if (this.mode() === 'login') {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    this.authService.login(this.authData.email, this.authData.password).subscribe({
      next: () => {
        this.toast.showSuccess('Ravi de vous revoir !');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.showError(err.error?.message || 'Identifiants incorrects');
        this.isLoading.set(false);
      }
    });
  }

  private handleRegister() {
    this.authService.register(this.authData).subscribe({
      next: () => {
        this.toast.showSuccess('Compte créé avec succès. Vous pouvez vous connecter.');
        this.mode.set('login');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.showError(err.error?.message || "Erreur lors de l'inscription");
        this.isLoading.set(false);
      }
    });
  }
}
