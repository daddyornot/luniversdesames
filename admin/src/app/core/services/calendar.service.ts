import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  attendees?: { email: string }[];
}

@Injectable({providedIn: 'root'})
export class CalendarService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/booking`;

  getEvents(start: string, end: string): Observable<GoogleEvent[]> {
    return this.http.get<GoogleEvent[]>(`${this.apiUrl}/events`, {
      params: { start, end }
    });
  }
}
