// import {Component} from '@angular/core';
// import {CommonModule} from '@angular/common';
// import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
// import {MatButtonModule} from '@angular/material/button';
// import {MediaLibraryComponent} from '../media-library/media-library';
//
// @Component({
//   selector: 'app-media-selector-dialog',
//   standalone: true,
//   imports: [CommonModule, MatDialogModule, MatButtonModule, MediaLibraryComponent],
//   template: `
//     <div class="h-full flex flex-col">
//       <div class="flex-1 overflow-y-auto p-6">
//         <app-media-library [isSelectionMode]="true" (imageSelected)="onImageSelected($event)"></app-media-library>
//       </div>
//       <div class="p-4 border-t border-gray-100 flex justify-end">
//         <button mat-button (click)="onClose()">Annuler</button>
//       </div>
//     </div>
//   `
// })
// export class MediaSelectorDialogComponent {
//   constructor(private dialogRef: MatDialogRef<MediaSelectorDialogComponent>) {}
//
//   onImageSelected(url: string) {
//     this.dialogRef.close(url);
//   }
//
//   onClose() {
//     this.dialogRef.close();
//   }
// }
