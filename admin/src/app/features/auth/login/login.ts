import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../core/auth/auth.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private auth = inject(AuthService);

  email = '';
  password = '';
  isLoading = signal(false);
  error = signal('');

  onSubmit() {
    this.isLoading.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      error: () => {
        this.error.set('Identifiants incorrects');
        this.isLoading.set(false);
      }
    });
  }
}
