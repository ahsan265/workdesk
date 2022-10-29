import { Injectable } from '@angular/core';

@Injectable()
export class ChartsData {
  constructor() {}
  calculateChartData(ChartData: Array<any>) {
    let data: any = [];
    ChartData.forEach((element) => {
      element.count === null ? data.push(0) : data.push(element.count);
    });
    return data;
  }
}
