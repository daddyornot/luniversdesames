import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ApiService} from '../../core/services/api.service';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private api = inject(ApiService);

  getSlotsForDate(date: Date): Observable<TimeSlot[]> {
    // Simulation robuste (à remplacer par appel API réel plus tard)
    // return this.api.get<TimeSlot[]>('booking/slots', { date: date.toISOString() });

    const slots: TimeSlot[] = [];
    const hours = [9, 10, 11, 14, 15, 16, 17];
    const baseDate = new Date(date);

    hours.forEach(h => {
      const start = new Date(baseDate);
      start.setHours(h, 0, 0, 0);
      const end = new Date(start);
      end.setHours(h + 1);

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        available: h !== 14
      });
    });

    return of(slots);
  }
}
