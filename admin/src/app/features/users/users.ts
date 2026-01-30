import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {UserService} from '../../core/services/user.service';
import {ToastService} from '../../services/toast/toast';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {UserDialogComponent} from './user-dialog';
import {UserDTO} from '../../core/api';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  users = signal<UserDTO[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.toast.showError('Erreur chargement utilisateurs')
    });
  }

  openDialog(user?: UserDTO) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.userService.updateUser(result.id, result).subscribe({
            next: () => {
              this.toast.showSuccess('Utilisateur mis à jour');
              this.loadUsers();
            },
            error: () => this.toast.showError('Erreur mise à jour')
          });
        } else {
          this.userService.createUser(result).subscribe({
            next: () => {
              this.toast.showSuccess('Utilisateur créé');
              this.loadUsers();
            },
            error: () => this.toast.showError('Erreur création')
          });
        }
      }
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
