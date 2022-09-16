/* eslint-disable sort-imports */
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Chart, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements AfterViewInit, OnDestroy {
  canvas: any;
  ctx: any;
  @ViewChild('chart') mychart: any;
  options: ChartOptions | undefined;
  data = new Subject();
  subscription!: Subscription;
  labels: any = [];
  chartObject: Chart | undefined;

  constructor() {}

  ngAfterViewInit() {
    this.subscription = this.data.subscribe((d: any) => {
      this.canvas = this.mychart.nativeElement;
      this.ctx = this.canvas.getContext('2d');
      if (this.chartObject) {
        this.chartObject.destroy();
      }
      this.chartObject = new Chart(this.ctx, {
        type: 'bar',
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              display: false
            },
            title: {
              display: false,
              text: 'Chart Title'
            }
          },
          scales: {
            xAxes: {
              display: true,
              grid: {
                display: false
              }
            },
            yAxes: {
              grid: {
                drawBorder: false
              }
            }
          }
        },
        data: {
          labels: d[2],
          datasets: [
            {
              label: '',
              type: 'bar',
              data: d[0],
              backgroundColor: d[1],
              borderColor: d[1]
            }
          ]
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
