import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private api = inject(ApiService);

  getAvailableSlots(date: string, bufferMinutes: number = 0): Observable<string[]> {
    return this.api.get<string[]>('booking/slots', {date, bufferMinutes});
  }
}
