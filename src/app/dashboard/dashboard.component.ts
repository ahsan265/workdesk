/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Component, HostListener, ViewChild } from '@angular/core';
import {
  cardDataTotalVisitors,
  countries,
  languauges,
  oneSelectData,
  ranges
} from './dashboardData';
import { AuthService } from '../services/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CommonEndpoints } from '../commonEndpoints/commonEndpoint';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { DashboardEndpointService } from './dashboardService/dashboard-endpoint.service';
import { DaterangepickerDirective } from '@gigaaa/gigaaa-components';
import * as dayjs from 'dayjs';
import { CalendarService } from '../calendarService/calendar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  oneSelectData = oneSelectData;
  countries = countries;
  languauges = languauges;
  incomingCardData = cardDataTotalVisitors;
  missedCardData = cardDataTotalVisitors;
  answeredCardData = cardDataTotalVisitors;
  startDate: string = '';
  endDate: string = '';

  idOfLanguage: Array<any> = [];
  idOfLocation: Array<any> = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective:
    | DaterangepickerDirective
    | undefined;

  @ViewChild('calendarDropdown') calendar: any = HTMLElement;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.calendar?.nativeElement.contains(event?.target)) {
      this.showCalendar = false;
    }
  }
  ranges = ranges;
  aggregate: string = 'this_week';
  date_from: any = dayjs().startOf('week').add(1, 'day');
  date_to: any = dayjs().endOf('week').add(1, 'day');
  selected: any = {
    startDate: this.date_from,
    endDate: this.date_to,
    aggregate: this.aggregate
  };
  alwaysShowCalendars: boolean;
  showCalendar: boolean = false;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
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
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: false
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: any;

  constructor(
    private authService: AuthService,
    private commonEps: CommonEndpoints,
    private sharedRes: SharedServices,
    private dashboardEps: DashboardEndpointService,
    private calendarService: CalendarService
  ) {
    this.authService.pageTitle.next('Dashboard');
    this.callRouteLoad();
    this.getFirstLoad();
    this.getCardsAndChartsData();
    this.alwaysShowCalendars = true;
  }

  getCardsAndChartsData() {
    this.dashboardEps.cardDataSubject.subscribe((data: any) => {
      this.incomingCardData = data?.incoming;
      this.missedCardData = data?.missed;
      this.answeredCardData = data?.answered;
    });
    this.dashboardEps.chartDataSubject.subscribe((data: any) => {
      this.barChartData = data?.incoming;
      this.barChartOptions;
    });
  }
  private async callRouteLoad(): Promise<void> {
    this.countries = await this.commonEps.getLocations();
    this.languauges = await this.commonEps.getLanguages();
    if (this.commonEps.getEpsParamLocal().project != undefined) {
      this.dashboardEps.getCarddata(
        this.commonEps.getIdsOfLanguage(),
        this.commonEps.getIdsOfLocation(),
        this.aggregate
      );
      this.dashboardEps.getChartData(
        this.commonEps.getIdsOfLanguage(),
        this.commonEps.getIdsOfLocation(),
        this.aggregate,
        this.startDate,
        this.endDate
      );
    }
  }
  private getFirstLoad(): void {
    this.sharedRes.LoadcommonEpsubject.subscribe(async (data) => {
      if (data == 1) {
        this.idOfLocation = this.commonEps.getIdsOfLocation();
        this.idOfLanguage = this.commonEps.getIdsOfLanguage();
        this.dashboardEps.getCarddata(
          this.idOfLanguage,
          this.idOfLocation,
          this.aggregate
        );
        this.dashboardEps.getChartData(
          this.idOfLanguage,
          this.idOfLocation,
          this.aggregate,
          this.startDate,
          this.endDate
        );
      }
    });
  }
  public locationOutput(locationOutput: number[]) {
    this.idOfLocation = locationOutput;
    this.dashboardEps.getCarddata(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate
    );
    this.dashboardEps.getChartData(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate,
      this.startDate,
      this.endDate
    );
  }
  public languaugesOutput(languaugesOutput: number[]) {
    this.idOfLanguage = languaugesOutput;
    this.dashboardEps.getCarddata(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate
    );
    this.dashboardEps.getChartData(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate,
      this.startDate,
      this.endDate
    );
  }

  change(event: any) {
    if (event.startDate) {
      this.date_from = event.startDate;
      this.date_to = event.endDate.add(1, 'day');

      // Needs to be updated
      let compareArray: any[] = [];
      for (const property in this.ranges) {
        if (
          this.date_from !== this.ranges[property][0] &&
          this.date_to !== this.ranges[property][1]
        ) {
          compareArray.push(this.ranges[property][0]);
        }
      }
      if (compareArray.length === 8) {
        this.aggregate = 'custom';
      }
    }
  }

  rangeClicked(event: any) {
    this.aggregate =
      event.label.charAt(0).toLowerCase() +
      event.label.slice(1).replace(/ /g, '_');
    this.startDate = this.calendarService.getDateRangeFormated(
      event.dates[0].$d
    );
    this.endDate = this.calendarService.getDateRangeFormated(event.dates[1].$d);
    this.dashboardEps.getCarddata(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate
    );
    this.dashboardEps.getChartData(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate,
      this.startDate,
      this.endDate
    );
  }

  onOpenCalendar() {
    this.showCalendar = !this.showCalendar;
  }
}
