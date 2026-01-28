import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalAppointments: number;
  newCustomers: number;
  averageBasket?: number;
  salesChart: { label: string; value: number }[];
  salesByCategory?: { name: string; value: number }[];
  topProducts?: { name: string; value: number }[];
}

@Injectable({providedIn: 'root'})
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getDashboardStats(period: string, startDate?: string, endDate?: string) {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params });
  }
}
