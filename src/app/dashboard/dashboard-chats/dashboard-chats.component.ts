import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import dayjs from 'dayjs';
import { BaseChartDirective } from 'ng2-charts';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';
import { oneSelectData, countries, languauges, cardDataTotalVisitors, ranges } from '../dashboardData';
import { DashboardEndpointService } from '../dashboardService/dashboard-endpoint.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { OneSelect } from 'src/app/models/oneSelect';

@Component({
  selector: 'app-dashboard-chats',
  templateUrl: './dashboard-chats.component.html',
  styleUrls: ['./dashboard-chats.component.scss']
})
export class DashboardChatsComponent {
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
  browserRefresh = false;
  constructor(
    private authService: AuthService,
    private CommonService: CommonService,
    private SharedServices: SharedServices,
    private dashboardEps: DashboardEndpointService,
    private calendarService: CalendarService,
    private router: Router

  ) {
    this.getFirstLoad();
    this.authService.pageTitle.next('Dashboard');
    this.getCardsAndChartsData();
    this.alwaysShowCalendars = true;
  }
  async ngOnInit(): Promise<void> {
    this.countries = await this.CommonService.getLocations();
    if (this.CommonService.getEndpointsParamLocal().token === this.authService.user.value?.api_token) {
      this.callRouteLoad()
    }
    else {
      this.authService.user.next(this.authService.getLoggedUser());
    }
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
  private async callRouteLoad() {
    this.languauges = await this.CommonService.getProjectLanguagesForUser();
    this.countries = await this.CommonService.getLocations();
    if (this.CommonService.getEndpointsParamLocal().project != undefined) {
      this.dashboardEps.getAnalyticsData([], [], this.aggregate, 'chat_filter');
    }
  }
  private getFirstLoad(): void {
    this.SharedServices.LoadcommonEpsubject.subscribe(async (data) => {
      if (data === 1) {
        this.CommonService.restrictRoute();
        this.setDefaultDate();
        this.languauges = await this.CommonService.getProjectLanguagesForUser();
        this.countries = await this.CommonService.getLocations();
        this.idOfLanguage = [];
        this.idOfLocation = [];
      }
    });
  }
  public locationOutput(locationOutput: number[]) {
    this.idOfLocation = locationOutput;
    this.dashboardEps.getAnalyticsData(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate,
      'chat_filter'
    );
  }
  public languaugesOutput(languaugesOutput: number[]) {
    this.idOfLanguage = languaugesOutput;
    this.dashboardEps.getAnalyticsData(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate,
      'chat_filter'
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
    this.dashboardEps.getAnalyticsData(
      this.idOfLanguage,
      this.idOfLocation,
      this.aggregate,
      'chat_filter'
    );
  }

  onOpenCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  //default date param 

  setDefaultDate() {
    this.aggregate = "this_week";
    this.selected = {
      startDate: dayjs().startOf('week').add(1, 'day'),
      endDate: dayjs().endOf('week').add(1, 'day'),
      aggregate: this.aggregate
    }
  }
    // select Dashboard type
    oneSelectOutput(event: OneSelect) {
      if (event.name === 'Calls') {
        this.CommonService.setDashboardType(['dashboard', 'calls']);
      }
    }
}
