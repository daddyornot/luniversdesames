import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalAppointments: number;
  newCustomers: number;
  salesChart: { label: string; value: number }[];
}

@Injectable({providedIn: 'root'})
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = '/api/dashboard';

  getDashboardStats(period: string, startDate?: string, endDate?: string) {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params });
  }
}
