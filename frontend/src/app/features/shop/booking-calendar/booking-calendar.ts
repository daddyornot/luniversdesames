import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingControllerService } from '../../../core/api';

@Component({
    selector: 'app-booking-calendar',
    standalone: true,
    imports: [CommonModule, MatIconModule, DatePipe],
    templateUrl: './booking-calendar.html'
})
export class BookingCalendar implements OnChanges {
    private readonly bookingService = inject(BookingControllerService);

    @Input() bufferMinutes: number = 0;
    @Input() sessionCount!: number | undefined;
    @Output() slotSelected = new EventEmitter<string>();

    selectedDate = signal<Date>(new Date());
    availableSlots = signal<string[]>([]);
    selectedSlot = signal<string | null>(null);
    isLoading = signal(false);

    nextDays = signal<Date[]>(this.generateNextDays());

    constructor() {
        this.loadSlots(this.selectedDate());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['bufferMinutes'] && !changes['bufferMinutes'].firstChange) {
            this.loadSlots(this.selectedDate());
        }
    }

    selectDate(date: Date) {
        this.selectedDate.set(date);
        this.selectedSlot.set(null);
        this.loadSlots(date);
    }

    selectSlot(slotIso: string) {
        this.selectedSlot.set(slotIso);
        this.slotSelected.emit(slotIso);
    }

    private loadSlots(date: Date) {
        this.isLoading.set(true);
        const dateStr = date.toISOString().split('T')[0];

        this.bookingService.getAvailableSlots(dateStr, this.bufferMinutes).subscribe({
            next: (slots) => {
                this.availableSlots.set(slots);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erreur chargement créneaux', err);
                this.availableSlots.set([]);
                this.isLoading.set(false);
            }
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
