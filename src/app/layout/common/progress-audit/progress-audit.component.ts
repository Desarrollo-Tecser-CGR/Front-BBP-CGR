import { Component, Input, ViewEncapsulation, OnChanges, SimpleChange } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexResponsive } from 'ng-apexcharts';
 import { NgIf } from '@angular/common';
@Component({
  selector: 'app-progress-audit',
  standalone   : true,
  templateUrl: './progress-audit.component.html',
  styleUrls: ['./progress-audit.component.scss'],
  encapsulation: ViewEncapsulation.None,
      imports: [
        NgApexchartsModule,
      ]
})
export class ProgressAuditComponent {
  // Datos iniciales de la gráfica
  @Input() CodeAudit:string;
  @Input() idAudit: number;
  chartOptions:any;
 
  // Estado de los checkboxes
  progress: number = 0;
 
  // Opciones del gráfico
  ngOnInit(){
    this.chartOptions = {
      chart: {
        type: "radialBar",
        animations: {
          enabled: true,
          easing: "easeout",
          speed: 1200, 
        },
      },
      plotOptions: {
        circularBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e0e0e0",
            strokeWidth: "97%",
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
            },
            value: {
              formatter: function (val:number) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          gradientToColors: ["#00c6ff"],
          stops: [0, 100],
        },
      },
      labels: ["Progreso"],
    };
  }

  updateProgress(newValue: number) {
    this.progress = Number(newValue);
  }
}
 
export class ChartModule {}
 