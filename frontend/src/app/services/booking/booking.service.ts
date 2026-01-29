import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingControllerService } from '../../core/api';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly api = inject(BookingControllerService);

    getAvailableSlots(date: string, bufferMinutes: number = 0): Observable<string[]> {
        return this.api.getAvailableSlots(date, bufferMinutes);
    }
}
