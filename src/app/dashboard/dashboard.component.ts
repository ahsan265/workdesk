/* eslint-disable no-undef */
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('count') count!: any;
  chartBarData: any = [[], [], []];

  constructor() {}
  ngOnInit(): void {
    this.chartBarData = [
      [56, 47, 55, 42, 0, 0, 0],
      [
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB'
      ],
      ['Jun 27', 'Jun 28', 'Jun 29', 'Jun 30', 'Jul 1', 'Jul 2', 'Jul 3']
    ];
    console.log(this.chartBarData);
    this.count?.data.next(this.chartBarData);
  }
}
