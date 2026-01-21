import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {UserService, User} from '../../core/services/user.service';
import {ToastService} from '../../services/toast/toast';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-6 pb-24">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-serif text-admin-dark">Utilisateurs</h1>
        <button routerLink="/users/new" class="bg-admin-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600 transition-colors">
          <mat-icon>person_add</mat-icon>
          Ajouter un utilisateur
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase">Nom</th>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase">Localisation</th>
              <th class="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (user of users(); track user.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4">
                  <div class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-xs text-gray-400">{{ user.phone || '-' }}</div>
                </td>
                <td class="p-4 text-gray-600">{{ user.email }}</td>
                <td class="p-4 text-gray-600">
                  {{ user.city ? user.city + ', ' + user.country : '-' }}
                </td>
                <td class="p-4 text-right">
                  <button (click)="deleteUser(user.id)" class="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors z-10 relative">
                    <mat-icon class="text-base">delete</mat-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="p-8 text-center text-gray-400 italic">Aucun utilisateur trouvé.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private toast = inject(ToastService);

  users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.toast.showError('Erreur chargement utilisateurs')
    });
  }

  deleteUser(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toast.showSuccess('Utilisateur supprimé');
          this.loadUsers();
        },
        error: () => this.toast.showError('Erreur lors de la suppression')
      });
    }
  }
}
