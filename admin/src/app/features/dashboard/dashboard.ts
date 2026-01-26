import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Color, NgxChartsModule, ScaleType} from '@swimlane/ngx-charts';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DashboardStats, StatsService} from '../../core/services/stats.service';
import {curveMonotoneX} from 'd3-shape';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialog} from '@angular/material/dialog'; // Import MatDialog
import {ProductForm} from '../product-form/product-form'; // Import ProductForm

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NgxChartsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private statsService = inject(StatsService);
  private dialog = inject(MatDialog); // Inject MatDialog

  selectedPeriod = 'CURRENT_MONTH';
  startDate: Date | null = null;
  endDate: Date | null = null;

  stats = signal<DashboardStats | null>(null);
  salesData = signal<any[]>([]);
  yScaleMax = signal<number>(100);
  hasSales = signal<boolean>(false);
  curve = curveMonotoneX;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6']
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    let startStr, endStr;

    if (this.selectedPeriod === 'CUSTOM' && this.startDate && this.endDate) {
      startStr = this.startDate.toISOString().split('T')[0];
      endStr = this.endDate.toISOString().split('T')[0];
    }

    this.statsService.getDashboardStats(this.selectedPeriod, startStr, endStr).subscribe({
      next: (data: any) => {
        this.stats.set(data);

        let series = [];

        if (data.salesChart) {
          series = data.salesChart.map((point: any) => ({
            name: point.label,
            value: point.value
          }));
        } else if (data.salesByMonth) {
          series = Object.entries(data.salesByMonth).map(([name, value]) => ({
            name,
            value
          }));
        }

        if (series.length > 0) {
          this.salesData.set([{
            name: "Ventes",
            series: series
          }]);

          const maxVal = Math.max(...series.map((s: any) => s.value));
          this.yScaleMax.set(maxVal > 0 ? maxVal * 1.1 : 100);
          this.hasSales.set(maxVal > 0);
        } else {
          this.salesData.set([]);
          this.hasSales.set(false);
        }
      },
      error: (err) => console.error('Error loading stats', err)
    });
  }


}
