import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Order, OrderService} from '../../core/services/order.service';
import {ToastService} from '../../services/toast/toast';
import {OrderDetailComponent} from './order-detail/order-detail';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  orders = signal<Order[]>([]);
  filter = signal('');

  displayedColumns: string[] = ['invoiceNumber', 'customer', 'date', 'total', 'status', 'actions'];

  filteredOrders = computed(() => {
    const search = this.filter().toLowerCase();
    return this.orders().filter(o =>
      o.customerName.toLowerCase().includes(search) ||
      o.invoiceNumber.toLowerCase().includes(search) ||
      o.customerEmail.toLowerCase().includes(search)
    );
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: () => this.toast.showError('Erreur chargement commandes')
    });
  }

  updateFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filter.set(input.value);
  }

  openDetail(order: Order) {
    this.dialog.open(OrderDetailComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: order
    });
  }

  exportExcel() {
    const data = this.filteredOrders();
    if (data.length === 0) {
      this.toast.showError('Aucune donnée à exporter');
      return;
    }

    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Reference;Client;Email;Date;Total;Statut\n";

    // CSV Rows
    data.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('fr-FR');
      const row = `${order.invoiceNumber};${order.customerName};${order.customerEmail};${date};${order.totalAmount};Payé`;
      csvContent += row + "\n";
    });

    // Total Row
    const totalRevenue = data.reduce((sum, order) => sum + order.totalAmount, 0);
    csvContent += `;;;;TOTAL: ${totalRevenue.toFixed(2)};\n`;

    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "commandes_univers_des_ames.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
