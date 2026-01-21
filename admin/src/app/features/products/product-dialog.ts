import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="flex justify-between items-center p-6 border-b border-gray-100">
      <h2 class="text-xl font-bold text-gray-800 m-0">{{data ? 'Modifier' : 'Ajouter'}} un produit</h2>
      <button mat-icon-button (click)="onCancel()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col h-full">
      <mat-dialog-content class="flex-1 p-6 overflow-y-auto max-h-[70vh]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- Basic Info -->
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Informations de base</h3>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nom du produit</mat-label>
            <input matInput formControlName="name" placeholder="Ex: Bracelet Améthyste">
            <mat-error *ngIf="form.get('name')?.hasError('required')">Le nom est requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="PHYSICAL">Produit Physique</mat-option>
              <mat-option value="SERVICE">Service</mat-option>
              <mat-option value="SUBSCRIPTION">Abonnement</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-span-1 md:col-span-2 w-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Description détaillée..."></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Prix (€)</mat-label>
            <input matInput type="number" formControlName="price" min="0">
            <mat-error *ngIf="form.get('price')?.hasError('required')">Le prix est requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Pierre associée</mat-label>
            <input matInput formControlName="stone" placeholder="Ex: Améthyste">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-span-1 md:col-span-2 w-full">
            <mat-label>URL de l'image</mat-label>
            <input matInput formControlName="imageUrl" placeholder="https://...">
          </mat-form-field>

          <!-- Specific Fields based on Type -->
          <ng-container *ngIf="form.get('type')?.value === 'SERVICE' || form.get('type')?.value === 'SUBSCRIPTION'">
             <div class="col-span-1 md:col-span-2 mt-4">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Détails du service</h3>
            </div>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nombre de séances</mat-label>
              <input matInput type="number" formControlName="sessionCount" min="1">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Durée (mois)</mat-label>
              <input matInput type="number" formControlName="durationMonths" min="1">
            </mat-form-field>
          </ng-container>

        </div>
      </mat-dialog-content>

      <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          {{data ? 'Enregistrer' : 'Créer'}}
        </button>
      </div>
    </form>
  `
})
export class ProductDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.form = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      description: [data?.description || ''],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      stone: [data?.stone || ''],
      imageUrl: [data?.imageUrl || ''],
      type: [data?.type || 'PHYSICAL', Validators.required],
      sessionCount: [data?.sessionCount || null],
      durationMonths: [data?.durationMonths || null]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
