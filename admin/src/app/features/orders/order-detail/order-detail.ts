import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Order, OrderService} from '../../../core/services/order.service';
import {ToastService} from '../../../services/toast/toast';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './order-detail.html'
})
export class OrderDetailComponent {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  constructor(
    public dialogRef: MatDialogRef<OrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  downloadInvoice() {
    this.orderService.downloadInvoice(this.data.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture-${this.data.invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toast.showError('Erreur lors du téléchargement de la facture')
    });
  }

  createShipping() {
    this.orderService.createShippingLabel(this.data.id).subscribe({
      next: () => {
        this.toast.showSuccess('Étiquette créée avec succès');
        this.dialogRef.close(true); // Close and refresh
      },
      error: () => this.toast.showError('Erreur lors de la création de l\'étiquette')
    });
  }
}
