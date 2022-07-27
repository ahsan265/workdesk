/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Component, ViewChild } from '@angular/core';
import {
  cardDataTotalVisitors,
  countries,
  languauges,
  oneSelectData
} from './dashboardData';
import { AuthService } from '../services/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CommonEndpoints } from '../commonEndpoints/commonEndpoint';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { DashboardEndpointService } from './dashboardService/dashboard-endpoint.service';

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

  idOfLanguage: Array<any> = [];
  idOfLocation: Array<any> = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: ['#1C54DB'],
        hoverBackgroundColor: ['#1C54DB'],
        borderRadius: 10
      }
    ]
  };

  constructor(
    private authService: AuthService,
    private commonEps: CommonEndpoints,
    private sharedRes: SharedServices,
    private dashboardEps: DashboardEndpointService
  ) {
    this.authService.pageTitle.next('Dashboard');
    this.callRouteLoad();
    this.getFirstLoad();
    this.getCardsAndChartsData();
  }

  getCardsAndChartsData() {
    this.dashboardEps.cardDataSubject.subscribe((data: any) => {
      this.incomingCardData = data?.incoming;
      this.missedCardData = data?.missed;
      this.answeredCardData = data?.answered;
    });
    this.dashboardEps.chartDataSubject.subscribe((data: any) => {
      this.barChartData = data?.incoming;
    });
  }
  private async callRouteLoad(): Promise<void> {
    
      this.countries = await this.commonEps.getLocations();
      this.languauges = await this.commonEps.getLanguages();
      if (this.commonEps.getEpsParamLocal().project != undefined) {
      this.dashboardEps.getCarddata(
        this.commonEps.getIdsOfLanguage(),
        this.commonEps.getIdsOfLocation()
      );
      this.dashboardEps.getChartData(
        this.commonEps.getIdsOfLanguage(),
        this.commonEps.getIdsOfLocation()
      );
    }
  }
  private getFirstLoad(): void {
    this.sharedRes.LoadcommonEpsubject.subscribe(async (data) => {
      if (data == 1) {
        this.idOfLocation = this.commonEps.getIdsOfLocation();
        this.idOfLanguage = this.commonEps.getIdsOfLanguage();
        this.dashboardEps.getCarddata(this.idOfLanguage, this.idOfLocation);
        this.dashboardEps.getChartData(this.idOfLanguage, this.idOfLocation);
      }
    });
  }
  public locationOutput(locationOutput: number[]) {
    //let selectedLcoationId = this.commonEps.getLocationSelected(locationOutput);
    this.idOfLocation = locationOutput;
    this.dashboardEps.getCarddata(this.idOfLanguage, this.idOfLocation);
    this.dashboardEps.getChartData(this.idOfLanguage, this.idOfLocation);
  }
  public languaugesOutput(languaugesOutput: number[]) {
    console.log(languaugesOutput);
    //  let selectLanguageId = this.commonEps.getLanguageSelected(languaugesOutput);
    this.idOfLanguage = languaugesOutput;
    this.dashboardEps.getCarddata(this.idOfLanguage, this.idOfLocation);
    this.dashboardEps.getChartData(this.idOfLanguage, this.idOfLocation);
  }
}
