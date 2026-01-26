// import { Component, Inject, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MediaSelectorDialogComponent } from '../media/media-selector-dialog/media-selector-dialog';
// import {Product, ProductType} from '../../core/models/product';
//
// @Component({
//   selector: 'app-product-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatIconModule
//   ],
//   templateUrl: './product-dialog.html'
// })
// export class ProductDialogComponent {
//   form: FormGroup;
//   productTypes: ProductType[] = ['PHYSICAL', 'ENERGY_CARE', 'CARD_READING', 'COACHING', 'SUBSCRIPTION'];
//
//   private dialog = inject(MatDialog);
//
//   constructor(
//     private fb: FormBuilder,
//     private dialogRef: MatDialogRef<ProductDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: Product | null
//   ) {
//     this.form = this.fb.group({
//       id: [data?.id || null],
//       name: [data?.name || '', Validators.required],
//       description: [data?.description || ''],
//       price: [data?.price || 0, [Validators.required, Validators.min(0)]],
//       stone: [data?.stone || ''],
//       imageUrl: [data?.imageUrl || ''],
//       type: [data?.type || 'PHYSICAL', Validators.required],
//       sessionCount: [data?.sessionCount || null],
//       durationMonths: [data?.durationMonths || null],
//       variants: this.fb.array([])
//     });
//
//     if (data?.variants) {
//       data.variants.forEach(v => this.addVariant(v));
//     }
//   }
//
//   get variants() {
//     return this.form.get('variants') as FormArray;
//   }
//
//   addVariant(data?: any) {
//     const variantGroup = this.fb.group({
//       id: [data?.id || null],
//       label: [data?.label || '', Validators.required],
//       price: [data?.price || 0, Validators.required],
//       sessionCount: [data?.sessionCount || null],
//       durationMonths: [data?.durationMonths || null]
//     });
//     this.variants.push(variantGroup);
//   }
//
//   removeVariant(index: number) {
//     this.variants.removeAt(index);
//   }
//
//   openMediaLibrary() {
//     const dialogRef = this.dialog.open(MediaSelectorDialogComponent, {
//       width: '800px',
//       height: '600px'
//     });
//
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.form.patchValue({ imageUrl: result });
//       }
//     });
//   }
//
//   onSubmit() {
//     if (this.form.valid) {
//       this.dialogRef.close(this.form.value);
//     }
//   }
//
//   onCancel() {
//     this.dialogRef.close();
//   }
// }
