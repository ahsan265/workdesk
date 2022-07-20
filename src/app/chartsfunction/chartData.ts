import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartsData {
  constructor() {

  }
  calculateChartData(val: Array<any>) {
    let data: any = []
    val.forEach(element => {
      (element.count == null) ? data.push(0) : data.push(element.count);
    });
    console.log(data)
    return data;
  }
}
