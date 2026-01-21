import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ToastService} from '../../services/toast/toast';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: 'contact.html'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  isSending = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.isSending.set(true);
    const payload = this.form.value;

    // Simulation d'envoi ou appel API réel
    // Pour l'instant on simule car le endpoint n'existe pas encore
    setTimeout(() => {
      this.isSending.set(false);
      this.toast.showSuccess('Message envoyé avec succès !');
      this.form.reset();
    }, 1500);

    // TODO: Décommenter quand le backend aura le endpoint /contact
    /*
    this.http.post(`${API_CONFIG.baseUrl}/contact`, payload).subscribe({
      next: () => {
        this.isSending.set(false);
        this.toast.showSuccess('Message envoyé avec succès !');
        this.form.reset();
      },
      error: () => {
        this.isSending.set(false);
        this.toast.showError('Erreur lors de l\'envoi du message');
      }
    });
    */
  }
}
