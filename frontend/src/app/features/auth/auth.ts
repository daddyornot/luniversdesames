import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../core/auth/auth';
import {ToastService} from '../../services/toast/toast';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './auth.html'
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // État local : 'login' ou 'register'
  mode = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  authForm!: FormGroup;

  ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'register') {
        this.mode.set('register');
      }
    });
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [this.passwordMatchValidator]],
      firstName: [''],
      lastName: [''],
      phone: [''],
      address: [''],
      postalCode: [''],
      city: [''],
      country: ['France']
    });

    // Recalculer la validité de la confirmation quand le mot de passe change
    this.authForm.get('password')?.valueChanges.subscribe(() => {
      this.authForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Validateur personnalisé
  passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    if (this.mode() === 'login') return null; // Pas de validation en mode login
    const password = control.parent?.get('password')?.value;
    const confirm = control.value;
    return password === confirm ? null : { mismatch: true };
  }

  toggleMode() {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    // Mettre à jour la validation du champ confirmation lors du changement de mode
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.authForm.value;

    if (this.mode() === 'login') {
      this.handleLogin(formValue);
    } else {
      this.handleRegister(formValue);
    }
  }

  private handleLogin(data: any) {
    this.authService.login(data.email, data.password).subscribe({
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

  private handleRegister(data: any) {
    this.authService.register(data).subscribe({
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
