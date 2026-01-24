import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MediaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/media';

  uploadFile(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>(this.apiUrl, formData);
  }

  deleteFile(url: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { params: { url } });
  }

  listFiles(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
