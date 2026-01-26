import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MediaService} from '../../../core/services/media.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../services/toast/toast';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './media-library.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaLibraryComponent implements OnInit {
  private mediaService = inject(MediaService);
  private toast = inject(ToastService);
  private clipboard = inject(Clipboard);

  // Injection pour le Dialog (optionnel si utilisé hors dialog, mais ici on l'utilise en dialog)
  private dialogRef = inject(MatDialogRef<MediaLibraryComponent>, { optional: true });
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  images = signal<string[]>([]);
  isUploading = signal(false);

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.mediaService.listFiles().subscribe({
      next: (urls) => this.images.set(urls),
      error: () => this.toast.showError('Erreur chargement images')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    this.isUploading.set(true);
    this.mediaService.uploadFile(file).subscribe({
      next: (res) => {
        this.toast.showSuccess('Image uploadée');
        this.loadImages();
        this.isUploading.set(false);
      },
      error: () => {
        this.toast.showError('Erreur upload');
        this.isUploading.set(false);
      }
    });
  }

  deleteImage(url: string) {
    if (confirm('Supprimer cette image ?')) {
      this.mediaService.deleteFile(url).subscribe({
        next: () => {
          this.toast.showSuccess('Image supprimée');
          this.loadImages();
        },
        error: () => this.toast.showError('Erreur suppression')
      });
    }
  }

  selectImage(url: string) {
    if (this.dialogRef) {
      this.dialogRef.close(url); // Ferme le dialog et renvoie l'URL
    } else {
      this.clipboard.copy(url);
      this.toast.showSuccess('URL copiée !');
    }
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
