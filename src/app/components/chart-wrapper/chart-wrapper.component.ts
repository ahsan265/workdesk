/* eslint-disable no-undef */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.scss']
})
export class ChartWrapperComponent implements OnInit {
  @Input() showData!: boolean;
  @Input() chartData!: any[];
  @Input() splitedArray!: any[];
  @Input() showLegend!: boolean;
  @Input() wrapperTitle!: string;

  leftArray: any[] = [];
  rightArray: any[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.chartData);
  }
}
