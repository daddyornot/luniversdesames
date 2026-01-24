import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CalendarService, GoogleEvent} from '../../core/services/calendar.service';
import {DatePipe} from '@angular/common';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  customer?: string;
  type: 'GOOGLE';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  private calendarService = inject(CalendarService);

  viewDate = signal(new Date());
  events = signal<CalendarEvent[]>([]);

  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendarDays = signal<Date[]>([]);

  ngOnInit() {
    this.generateCalendarDays();
    this.loadEvents();
  }

  loadEvents() {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();

    const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const end = new Date(year, month + 2, 0).toISOString().split('T')[0];

    this.calendarService.getEvents(start, end).subscribe({
      next: (googleEvents) => {
        const loadedEvents: CalendarEvent[] = googleEvents.map(ev => {
          let customer = '';
          if (ev.description) {
            const match = ev.description.match(/Client : (.*?)(\n|$)/);
            if (match) {
              customer = match[1].trim();
            }
          }

          const parseDate = (val: any): Date => {
            if (!val) return new Date();
            if (typeof val === 'string') return new Date(val);
            if (typeof val === 'object' && val.value) return new Date(val.value);
            return new Date(val);
          };

          const startDt = parseDate(ev.start.dateTime || ev.start.date);
          const endDt = parseDate(ev.end.dateTime || ev.end.date);

          return {
            id: ev.id,
            title: ev.summary,
            start: startDt,
            end: endDt,
            description: ev.description,
            customer: customer,
            type: 'GOOGLE'
          };
        });

        this.events.set(loadedEvents);
      },
      error: (err) => console.error('Error loading events', err)
    });
  }

  generateCalendarDays() {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: Date[] = [];

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    for (let i = startDayOfWeek; i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    this.calendarDays.set(days);
  }

  previousMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    this.generateCalendarDays();
    this.loadEvents();
  }

  nextMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    this.generateCalendarDays();
    this.loadEvents();
  }

  today() {
    this.viewDate.set(new Date());
    this.generateCalendarDays();
    this.loadEvents();
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events().filter(event =>
      event.start.getDate() === date.getDate() &&
      event.start.getMonth() === date.getMonth() &&
      event.start.getFullYear() === date.getFullYear()
    );
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.viewDate().getMonth();
  }
}
