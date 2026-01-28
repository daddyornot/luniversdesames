import {inject, Injectable, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface Stone {
  id: number;
  name: string;
  description: string;
}

@Injectable({providedIn: 'root'})
export class StoneService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = isDevMode() ? 'http://localhost:8080/api/stones' : '/api/stones';

  getAllStones() {
    return this.http.get<Stone[]>(this.apiUrl);
  }

  createStone(stone: Partial<Stone>) {
    return this.http.post<Stone>(this.apiUrl, stone);
  }

  deleteStone(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
