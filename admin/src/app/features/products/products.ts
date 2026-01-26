import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Product} from '../../core/models/product';
import {ProductService} from '../../core/services/product.service';
import {ProductForm} from '../product-form/product-form';

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

  // openDialog(product?: Product): void {
  //   const dialogRef = this.dialog.open(ProductDialogComponent, {
  //     width: '800px',
  //     maxHeight: '90vh',
  //     data: product || null
  //   });
  //

  //   });
  // }
  openProductForm(productId?: number) {
    const dialogRef = this.dialog.open(ProductForm, {
      width: '800px',
      data: { id: productId } // Passe l'ID au dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si le dialog a renvoyé true (produit modifié/créé), rafraîchir la liste des produits
        this.loadProducts(); // Assurez-vous d'avoir une méthode pour recharger les produits
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
