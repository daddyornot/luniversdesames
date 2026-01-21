import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {BookingService, TimeSlot} from '../../../services/booking/booking';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePipe],
  templateUrl: './booking-calendar.html'
})
export class BookingCalendar {
  private bookingService = inject(BookingService);

  @Output() slotSelected = new EventEmitter<string>();

  selectedDate = signal<Date>(new Date());
  availableSlots = signal<TimeSlot[]>([]);
  selectedSlot = signal<string | null>(null);

  nextDays = signal<Date[]>(this.generateNextDays());

  constructor() {
    // On charge les slots initiaux
    this.loadSlots(this.selectedDate());
  }

  selectDate(date: Date) {
    console.log('Date sélectionnée:', date);
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
    this.loadSlots(date);
  }

  selectSlot(slotStart: string) {
    this.selectedSlot.set(slotStart);
    this.slotSelected.emit(slotStart);
  }

  private loadSlots(date: Date) {
    this.bookingService.getSlotsForDate(date).subscribe(slots => {
      console.log('Créneaux reçus pour', date.toDateString(), slots);
      this.availableSlots.set(slots);
    });
  }

  private generateNextDays(): Date[] {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }
}
