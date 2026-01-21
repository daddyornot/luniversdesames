import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  getAllUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: any) {
    return this.http.post(this.apiUrl, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
