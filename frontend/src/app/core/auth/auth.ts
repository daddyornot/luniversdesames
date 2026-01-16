import { LocalStorageService } from '../local-storage/local-storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorageService)

  // Le signal magique qui dit à toute l'app si on est logué
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  login(credentials: any) {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
