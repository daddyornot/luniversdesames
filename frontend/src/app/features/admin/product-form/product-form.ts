import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../../../services/product/product';
import {ToastService} from '../../../services/toast/toast';
import {ProductType} from '../../../core/models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  isEditMode = signal(false);
  productId: string | null = null;

  productTypes: ProductType[] = ['PHYSICAL', 'ENERGY_CARE', 'CARD_READING', 'COACHING'];

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    stone: [''],
    imageUrl: ['', [Validators.required]],
    type: ['PHYSICAL' as ProductType, [Validators.required]],
    sessionCount: [null as number | null],
    durationMonths: [null as number | null],
    variants: this.fb.array([])
  });

  get variants() {
    return this.form.get('variants') as FormArray;
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode.set(true);
      const productSignal = this.productService.getProductById(this.productId);
      const product = productSignal();

      if (product) {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stone: product.stone,
          imageUrl: product.imageUrl,
          type: product.type,
          sessionCount: product.sessionCount,
          durationMonths: product.durationMonths
        });

        // Charger les variantes
        if (product.variants) {
          product.variants.forEach(v => {
            this.addVariant(v);
          });
        }
      }
    }
  }

  addVariant(data?: any) {
    const variantGroup = this.fb.group({
      id: [data?.id || null],
      label: [data?.label || '', Validators.required],
      price: [data?.price || 0, Validators.required],
      sessionCount: [data?.sessionCount || null],
      durationMonths: [data?.durationMonths || null]
    });
    this.variants.push(variantGroup);
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const productData = this.form.value;

    if (this.isEditMode() && this.productId) {
      this.productService.updateProduct(+this.productId, productData).subscribe({
        next: () => {
          this.toast.showSuccess('Produit mis à jour');
          this.router.navigate(['/admin']);
        },
        error: () => this.toast.showError('Erreur lors de la mise à jour')
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.toast.showSuccess('Produit créé');
          this.router.navigate(['/admin']);
        },
        error: () => this.toast.showError('Erreur lors de la création')
      });
    }
  }
}
