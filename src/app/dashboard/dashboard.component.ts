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
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { DashboardEndpointService } from './dashboardService/dashboard-endpoint.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import * as dayjs from 'dayjs';
import { CalendarService } from '../calendarService/calendar.service';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { MessageService } from '../workdeskServices/messageService/message.service';

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

  idOfLanguage: Array<number> = [];
  idOfLocation: Array<number> = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(GigaaaDaterangepickerDirective, { static: false })
  pickerDirective: GigaaaDaterangepickerDirective | undefined;

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
    interaction: {
      mode: 'index'
    },

    borderColor: 'none',
    layout: {
      padding: {
        bottom: 24
      }
    },
    hover: {
      mode: 'index',
      intersect: false
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
        },
        ticks: {
          display: true,
          maxTicksLimit: 4,
          padding: 14
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        displayColors: false,
        callbacks: {
          title: function () {
            return '';
          }
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData1!: ChartData<'bar'>;
  public barChartData2!: ChartData<'bar'>;
  public barChartData3!: ChartData<'bar'>;

  constructor(
    private authService: AuthService,
    private CommonService: CommonService,
    private SharedServices: SharedServices,
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
    this.dashboardEps.chartDataSubject.subscribe((data: ChartData<'bar'>[]) => {
      this.barChartData1 = data[0];
      this.barChartData2 = data[1];
      this.barChartData3 = data[2];
    });
  }
  private async callRouteLoad(): Promise<void> {
    this.countries = await this.CommonService.getLocations();
    this.languauges = await this.CommonService.getProjectLanguagesForUser();
    if (this.CommonService.getEndpointsParamLocal().project != undefined) {
      this.dashboardEps.getCarddata([], [], this.aggregate);
      this.dashboardEps.getChartData(
        [],
        [],
        this.aggregate,
        this.startDate,
        this.endDate
      );
    }
  }
  private getFirstLoad(): void {
    this.SharedServices.LoadcommonEpsubject.subscribe(async (data) => {
      if (data === 1) {
        // this.idOfLocation = this.CommonService.getIdsOfLocation();
        // this.idOfLanguage = this.CommonService.getIdsOfLanguage();
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
    console.log(languaugesOutput);
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
        // this.aggregate = 'custom';
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
