import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  // Un signal pour suivre si une opération est en cours (optionnel mais utile)
  loading = signal(false);

  showSuccess(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['toast-success'], // On pourra styliser en vert
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Compris', {
      duration: 5000,
      panelClass: ['toast-error'], // On pourra styliser en rouge
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }
}
