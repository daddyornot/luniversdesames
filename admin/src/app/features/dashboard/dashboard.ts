import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Color, NgxChartsModule, ScaleType} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  salesData = [
    {
      "name": "Ventes",
      "series": [
        { "name": "Jan", "value": 2000 },
        { "name": "Fév", "value": 3500 },
        { "name": "Mar", "value": 2800 },
        { "name": "Avr", "value": 4200 },
        { "name": "Mai", "value": 5100 }
      ]
    }
  ];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6']
  };
}
