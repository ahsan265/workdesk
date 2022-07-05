/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent implements OnInit, AfterViewInit, OnDestroy {
  canvas: any;
  ctx: any;
  @ViewChild('chart') mychart: any;
  options: ChartOptions | undefined;
  data = new Subject();
  subscription!: Subscription;
  labels: any = [];
  chartObject: Chart | undefined;
  showNoData: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.subscription = this.data.subscribe((d: any) => {
      d[0] === 0 && d[3] === 0
        ? (this.showNoData = true)
        : (this.showNoData = false);
      this.canvas = this.mychart.nativeElement;
      this.ctx = this.canvas.getContext('2d');
      if (this.chartObject) {
        this.chartObject.destroy();
      }
      if (d[0] === 0 && d[3] === 0) {
        this.chartObject = new Chart(this.ctx, {
          type: 'line',
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                display: true,
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  color: 'black',
                  boxWidth: 10,
                  padding: 30,
                  boxHeight: 50
                }
              },
              title: {
                display: false,
                text: d[5][0],
                align: 'start'
              }
            },
            scales: {
              xAxes: {
                display: true,
                grid: {
                  display: false
                },
                offset: true
              },
              yAxes: {
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false
                }
              }
            }
          },
          data: {
            labels: d[2],
            datasets: [
              {
                label: d[5][1],
                data: d[0],
                fill: false,
                borderColor: d[1],
                backgroundColor: d[1],
                borderWidth: 3,
                tension: 0
              },
              {
                label: d[5][2],
                data: d[3],
                fill: false,
                borderColor: d[4],
                backgroundColor: d[4],
                borderWidth: 3,
                tension: 0
              }
            ]
          }
        });
      } else {
        this.chartObject = new Chart(this.ctx, {
          type: 'line',
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                display: true,
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  color: 'black',
                  boxWidth: 10,
                  padding: 30,
                  boxHeight: 50
                }
              },
              title: {
                display: false,
                text: d[5][0],
                align: 'start'
              }
            },
            scales: {
              xAxes: {
                display: true,
                grid: {
                  display: false
                },
                offset: true
              },
              yAxes: {
                grid: {
                  display: true,
                  drawBorder: false
                },
                ticks: {
                  display: true
                }
              }
            }
          },
          data: {
            labels: d[2],
            datasets: [
              {
                label: d[5][1],
                data: d[0],
                fill: false,
                borderColor: d[1],
                backgroundColor: d[1],
                borderWidth: 3,
                tension: 0
              },
              {
                label: d[5][2],
                data: d[3],
                fill: false,
                borderColor: d[4],
                backgroundColor: d[4],
                borderWidth: 3,
                tension: 0
              }
            ]
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
