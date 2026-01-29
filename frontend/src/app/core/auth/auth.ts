import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage';
import { AuthControllerService, RegisterRequest, UserDTO } from '../api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly api = inject(AuthControllerService);
    private readonly localStorage = inject(LocalStorageService);

    currentUser = signal<UserDTO | null>(this.getUserFromStorage());
    isAuthenticated = computed(() => !!this.currentUser());

    login(email: string, password: string) {
        return this.api.login({ email, password })
            .pipe(
                tap(res => {
                    this.localStorage.setItem('token', res.token);
                    this.api.getCurrentUserProfile()
                        .subscribe(user => {
                            this.localStorage.setItem('user', user);
                            this.currentUser.set(user);
                        });
                })
            );
    }

    register(userData: RegisterRequest) {
        return this.api.register(userData);
    }

    logout() {
        this.localStorage.removeItem('token');
        this.localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    private getUserFromStorage(): UserDTO | null {
        const storedUser = this.localStorage.getItem('user');
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser);
        } catch (e) {
            this.localStorage.removeItem('user');
            return null;
        }
    }
}
