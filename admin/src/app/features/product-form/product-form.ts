import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProductSize} from '../../core/models/product';
import {ProductService} from '../../core/services/product.service';
import {ProductVariant} from '../../core/models/product-variant';
import {MediaLibraryComponent} from '../media/media-library/media-library';
import {ToastService} from '../../services/toast/toast';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  private dialogRef = inject(MatDialogRef<ProductForm>);
  private data = inject(MAT_DIALOG_DATA);

  productForm!: FormGroup;
  isEditMode = signal(false);

  ngOnInit() {
    this.initForm();
    if (this.data && this.data.id) {
      this.isEditMode.set(true);
      this.loadProduct(this.data.id);
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stones: [''],
      imageUrl: [''],
      type: ['PHYSICAL', Validators.required],
      sessionCount: [null],
      durationMonths: [null],
      bufferTimeMinutes: [0],
      variants: this.fb.array([]),
      sizes: this.fb.array([])
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue({
        ...product,
        stones: product.stones ? product.stones.join(', ') : ''
      });

      product.variants?.forEach(variant => this.addVariant(variant));
      product.sizes?.forEach(size => this.addSize(size));
    });
  }

  openMediaLibrary() {
    const mediaDialog = this.dialog.open(MediaLibraryComponent, {
      width: '90vw',
      height: '80vh'
    });

    mediaDialog.afterClosed().subscribe(result => {
      if (result) {
        this.productForm.get('imageUrl')?.setValue(result);
      }
    });
  }

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  get sizes() {
    return this.productForm.get('sizes') as FormArray;
  }

  addVariant(variant?: ProductVariant) {
    const variantGroup = this.fb.group({
      id: [variant?.id || null],
      label: [variant?.label || '', Validators.required],
      price: [variant?.price || 0, [Validators.required, Validators.min(0)]],
      durationMonths: [variant?.durationMonths || null],
      sessionCount: [variant?.sessionCount || null]
    });
    (this.productForm.get('variants') as FormArray).push(variantGroup);
  }

  removeVariant(index: number) {
    (this.productForm.get('variants') as FormArray).removeAt(index);
  }

  addSize(size?: ProductSize) {
    const sizeGroup = this.fb.group({
      id: [size?.id || null],
      label: [size?.label || '', Validators.required],
      description: [size?.description || '']
    });
    (this.productForm.get('sizes') as FormArray).push(sizeGroup);
  }

  removeSize(index: number) {
    (this.productForm.get('sizes') as FormArray).removeAt(index);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.toast.showError('Veuillez corriger les erreurs du formulaire.');
      return;
    }

    const productData = this.productForm.value;
    productData.stones = productData.stones ? productData.stones.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [];

    const request = this.isEditMode()
      ? this.productService.updateProduct(productData.id, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.toast.showSuccess('Produit enregistré avec succès !');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toast.showError(err.error?.message || 'Erreur lors de l\'enregistrement du produit.');
      }
    });
  }
}
