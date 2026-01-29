import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProductSize, ProductVariant} from '../../core/models/product';
import {ProductService} from '../../core/services/product.service';
import {ProductSizeService} from '../../core/services/product-size.service';
import {Stone, StoneService} from '../../core/services/stone.service'; // Nouveau service
import {MediaLibraryComponent} from '../media/media-library/media-library';
import {ToastService} from '../../services/toast/toast';
import {MatCard, MatCardContent} from '@angular/material/card';
import { ProductDTO } from '../../core/api';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatCard,
    MatCardContent
  ],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private productSizeService = inject(ProductSizeService);
  private stoneService = inject(StoneService); // Injection
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  private dialogRef = inject(MatDialogRef<ProductForm>);
  private data = inject(MAT_DIALOG_DATA);

  productForm!: FormGroup;
  isEditMode = signal(false);

  availableSizes = signal<ProductSize[]>([]);
  availableStones = signal<Stone[]>([]); // Liste des pierres

  ngOnInit() {
    this.initForm();
    this.loadAvailableSizes();
    this.loadAvailableStones(); // Charger les pierres

    this.productForm.get('isSubscription')?.valueChanges.subscribe(isSub => {
      const intervalControl = this.productForm.get('recurringInterval');
      if (isSub) {
        intervalControl?.setValidators([Validators.required]);
      } else {
        intervalControl?.clearValidators();
        intervalControl?.setValue(null);
      }
      intervalControl?.updateValueAndValidity();
    });

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
      stones: this.fb.array([]), // FormArray pour les pierres
      imageUrl: [''],
      type: ['PHYSICAL', Validators.required],
      sessionCount: [null],
      durationMonths: [null],
      bufferTimeMinutes: [0],
      variants: this.fb.array([]),
      sizes: this.fb.array([]),
      isSubscription: [false],
      recurringInterval: [null]
    });
  }

  loadAvailableSizes() {
    this.productSizeService.getAllSizes().subscribe(sizes => this.availableSizes.set(sizes));
  }

  loadAvailableStones() {
    this.stoneService.getAllStones().subscribe(stones => this.availableStones.set(stones));
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue({
        ...product,
        // stones est géré manuellement ci-dessous
      });

      product.variants?.forEach(variant => this.addVariant(variant));

      // Tailles
      const sizesArray = this.productForm.get('sizes') as FormArray;
      sizesArray.clear();
      product.sizes?.forEach(size => {
        sizesArray.push(this.fb.group({
          id: [size.id],
          label: [size.label],
          description: [size.description]
        }));
      });

      // Pierres
      const stonesArray = this.productForm.get('stones') as FormArray;
      stonesArray.clear();
      product.stones?.forEach(stone => {
        stonesArray.push(this.fb.group({
          id: [stone.id],
          name: [stone.name],
          description: [stone.description]
        }));
      });
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

  get variants() { return this.productForm.get('variants') as FormArray; }
  get sizes() { return this.productForm.get('sizes') as FormArray; }
  get stones() { return this.productForm.get('stones') as FormArray; }

  // --- Gestion des Tailles ---
  isSizeSelected(sizeId: number): boolean {
    return this.sizes.controls.some(control => control.get('id')?.value === sizeId);
  }

  toggleSize(size: ProductSize, isChecked: boolean) {
    if (isChecked) {
      this.sizes.push(this.fb.group({ id: [size.id], label: [size.label], description: [size.description] }));
    } else {
      const index = this.sizes.controls.findIndex(control => control.get('id')?.value === size.id);
      if (index !== -1) this.sizes.removeAt(index);
    }
  }

  // --- Gestion des Pierres ---
  isStoneSelected(stoneId: number): boolean {
    return this.stones.controls.some(control => control.get('id')?.value === stoneId);
  }

  toggleStone(stone: Stone, isChecked: boolean) {
    if (isChecked) {
      this.stones.push(this.fb.group({ id: [stone.id], name: [stone.name], description: [stone.description] }));
    } else {
      const index = this.stones.controls.findIndex(control => control.get('id')?.value === stone.id);
      if (index !== -1) this.stones.removeAt(index);
    }
  }

  addVariant(variant?: ProductVariant) {
    const variantGroup = this.fb.group({
      id: [variant?.id || null],
      label: [variant?.label || '', Validators.required],
      price: [variant?.price || 0, [Validators.required, Validators.min(0)]],
      durationMonths: [variant?.durationMonths || null],
      sessionCount: [variant?.sessionCount || null]
    });
    this.variants.push(variantGroup);
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  addSize(size?: ProductSize) {
    const sizeGroup = this.fb.group({
      id: [size?.id || null],
      label: [size?.label || '', Validators.required],
      description: [size?.description || '']
    });
    this.sizes.push(sizeGroup);
  }

  removeSize(index: number) {
    this.sizes.removeAt(index);
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
    // Plus besoin de conversion manuelle pour stones, c'est déjà un tableau d'objets

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

    protected readonly ProductDTO = ProductDTO;
}
