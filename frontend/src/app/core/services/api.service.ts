import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common'; // Import isPlatformBrowser
import {environment} from '../../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); // Inject PLATFORM_ID
  private readonly _baseUrl: string;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // In the browser, use the apiUrl from the environment (can be relative or absolute)
      this._baseUrl = environment.apiUrl;
    } else {
      // On the server (SSR), we need an absolute URL for the backend
      // In production, environment.apiUrl should already be absolute (e.g., https://api.universdesames.fr/api)
      // In development (ng serve --ssr), environment.apiUrl is '/api', which is relative.
      // So, for development SSR, we explicitly point to the local backend.
      this._baseUrl = environment.production ? environment.apiUrl : 'http://localhost:8080/api';
    }
  }

  get<T>(path: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this._baseUrl}/${path}`, {params: httpParams});
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this._baseUrl}/${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this._baseUrl}/${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this._baseUrl}/${path}`);
  }
}
