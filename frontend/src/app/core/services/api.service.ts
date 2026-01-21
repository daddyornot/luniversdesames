import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_CONFIG} from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl;

  get<T>(path: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}/${path}`, {params: httpParams});
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }
}
