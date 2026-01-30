import {inject, Injectable, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { StoneDTO } from '../api';

@Injectable({providedIn: 'root'})
export class StoneService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = isDevMode() ? 'http://localhost:8080/api/stones' : '/api/stones';

  getAllStones() {
    return this.http.get<StoneDTO[]>(this.apiUrl);
  }

  createStone(stone: Partial<StoneDTO>) {
    return this.http.post<StoneDTO>(this.apiUrl, stone);
  }

  deleteStone(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
