import { Component, Input, ViewEncapsulation, OnChanges, SimpleChange } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexResponsive } from 'ng-apexcharts';
 import { NgIf, NgFor } from '@angular/common';
 import { MatIcon } from '@angular/material/icon';
 import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-progress-audit',
  standalone   : true,
  templateUrl: './progress-audit.component.html',
  styleUrls: ['./progress-audit.component.scss'],
  encapsulation: ViewEncapsulation.None,
      imports: [
        NgApexchartsModule,
        MatIcon,
        NgIf,
        MatCardModule
      ]
})
export class ProgressAuditComponent {
  // Datos iniciales de la gráfica
  @Input() CodeAudit:string;
  @Input() idAudit: number;
  chartOptions:any={};
  currentIndex = 0; 
  progress: number = 0;
  isActive : boolean = true;
 
  ngOnInit(){
    this.allGraphics();
    this.getgraphic(2);
  }
  getgraphic(index:number){
    this.currentIndex = index;
    this.isActive = true;
    return this.graphics[index];
  }
  allGraphics(){
    this.graphics[0].chartOptions = {
      chart: {
        type: 'pie', // Tipo de gráfica: torta
      },
      fill:{},
      labels: ['Completado', 'Pendiente'], // Etiquetas
      series: [70, 30], // Valores
      colors: ['#00E396', '#FF4560'], // Colores
    };
    this.graphics[1].chartOptions = {
      chart: {
        type: 'bar', // Tipo de gráfica: barra
      },
      plotOptions: {
        bar: {
          horizontal: false, // Barras verticales
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      fill:{},
      series: [
        {
          name: 'Progreso',
          data: [44, 55, 57, 56], // Datos de la barra
        },
      ],
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr'], // Categorías del eje X
      },
      colors: ['#008FFB'], // Color de las barras
    };
    this.graphics[2].chartOptions = {
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
    return this.graphics[0], this.graphics[1], this.graphics[2];
  }
  graphics = [
    {
    id: 1,
    progress:this.progress,
    chartOptions: this.chartOptions,
    },
    {
    id: 2,
    progress:this.progress,
    chartOptions: this.chartOptions,
    },
    {
    id: 3,
    progress:this.progress,
    chartOptions: this.chartOptions,
    },

]

  updateProgress(newValue: number) {
    this.progress = Number(newValue);
  }
}
 
export class ChartModule {}
 