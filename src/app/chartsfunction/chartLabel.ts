/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartLabel {
  constructor() {}
  caculateChartLabels(
    labelArray: Array<any>,
    range: string,
    numberofBars: any
  ) {
    let label: any = [];
    labelArray.forEach((element) => {
      let date = new Date(element.date).toDateString();
      let update = date.substring(0, date.length - 4);

      if (numberofBars === 1) {
        label.push(update);
      } else if (numberofBars === 7) {
        if (range === 'this_week' || range === 'last_week') {
          label.push(update[0]);
        } else {
          label.push(update.substring(4));
        }
      } else if (numberofBars > 12) {
        if (range === 'last_month' || range === 'this_month') {
          label.push(update.substring(4));
        }
      } else if (numberofBars == 12) {
        if (range === 'last_year' || range === 'this_year') {
          label.push(update.substring(4, 7));
        }
      }
    });
    return label;
  }
}
