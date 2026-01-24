import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ProductDialogComponent} from './product-dialog';
import {Product, ProductService} from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'stone', 'actions'];
  dataSource = signal<Product[]>([]);

  private dialog = inject(MatDialog);
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.dataSource.set(products);
    });
  }

  openDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: product || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.productService.updateProduct(result.id, result).subscribe(() => {
            this.loadProducts();
          });
        } else {
          this.productService.createProduct(result).subscribe(() => {
            this.loadProducts();
          });
        }
      }
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${product.name} ?`)) {
      if (product.id) {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.loadProducts();
        });
      }
    }
  }
}
