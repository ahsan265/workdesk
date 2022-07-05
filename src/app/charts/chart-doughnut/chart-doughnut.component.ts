/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart-doughnut',
  templateUrl: './chart-doughnut.component.html',
  styleUrls: ['./chart-doughnut.component.scss']
})
export class ChartDoughnutComponent implements OnInit {
  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart: any;
  data = new Subject();
  subscription!: Subscription;
  chartObject: Chart | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.subscription = this.data.subscribe((d: any) => {
      const isAllZero = d[0].every((item: any) => item === 0);
      this.canvas = this.mychart.nativeElement;
      this.ctx = this.canvas.getContext('2d');
      if (this.chartObject) {
        this.chartObject.destroy();
      }
      this.chartObject = new Chart(this.ctx, {
        type: 'doughnut',
        options: {
          radius: '100%',
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              display: false,
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                color: 'black', // color of text in legend
                boxWidth: 10
              }
            },
            title: {
              display: false,
              text: 'Chart.js Doughnut Chart'
            }
          }
        },
        data: {
          labels: d[2],
          datasets: [
            {
              data: !isAllZero ? d[0] : [1],
              backgroundColor: !isAllZero ? d[1] : '#EDEDF6',
              borderColor: !isAllZero ? d[1] : '#EDEDF6'
            }
          ]
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
