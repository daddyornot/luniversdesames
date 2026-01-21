import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {UserService} from '../../../core/services/user.service';
import {ToastService} from '../../../services/toast/toast';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button routerLink="/users" class="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-serif text-admin-dark">Nouvel Utilisateur</h1>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-xl shadow-sm space-y-6">

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Prénom</label>
              <input formControlName="firstName" type="text" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nom</label>
              <input formControlName="lastName" type="text" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input formControlName="email" type="email" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
            <input formControlName="password" type="password" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
          </div>

          <div class="border-t border-gray-100 pt-6 mt-6">
            <h3 class="font-bold text-gray-700 mb-4">Coordonnées (Optionnel)</h3>

            <div class="space-y-4">
              <input formControlName="phone" type="tel" placeholder="Téléphone" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
              <input formControlName="address" type="text" placeholder="Adresse" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">

              <div class="grid grid-cols-2 gap-6">
                <input formControlName="postalCode" type="text" placeholder="Code Postal" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
                <input formControlName="city" type="text" placeholder="Ville" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
              </div>

              <input formControlName="country" type="text" placeholder="Pays" class="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-admin-primary/20">
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" [disabled]="form.invalid" class="bg-admin-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-admin-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50">
              Créer l'utilisateur
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    address: [''],
    city: [''],
    postalCode: [''],
    country: ['']
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.userService.createUser(this.form.value).subscribe({
      next: () => {
        this.toast.showSuccess('Utilisateur créé avec succès');
        this.router.navigate(['/users']);
      },
      error: () => this.toast.showError("Erreur lors de la création (Email déjà pris ?)")
    });
  }
}
