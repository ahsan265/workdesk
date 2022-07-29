import { Injectable } from '@angular/core';
import { DateRange } from 'src/app/models/dateRangeModel';
import { dateRangeData } from './dateRageData';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  daysArray: DateRange[] = dateRangeData;
  constructor() {}
  public getDateRangeFormated(date: string) {
    const dataRequired = this.getFormatedData(date);
    return dataRequired;
  }

  private getFormatedData(date: string) {
    let dateRange = new Date(date);
    let month = '' + (dateRange.getMonth() + 1);
    let day = '' + dateRange.getDate();
    let year = dateRange.getFullYear();
    month.length < 2 ? (month = '0' + month) : '';
    day.length < 2 ? (day = '0' + day) : '';
    return [year, month, day].join('-');
  }
  public getRelatedDateRange(rangeSelected: string): string {
    const dateRangeRelated: any = this.daysArray.find(
      (data: DateRange) => data.rangeSelected === rangeSelected
    );
    return dateRangeRelated.rangeVs;
  }
}
