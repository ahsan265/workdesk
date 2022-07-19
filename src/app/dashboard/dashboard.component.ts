/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
import { commonEps } from '../commonEps/commonEps';
import { SharedServices } from '../services/shared.services';
import { DashboardEps } from './dashboardEp';

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

  constructor(private authService: AuthService,
    private commonEps:commonEps,private sharedRes:SharedServices,
    private dashboardEps:DashboardEps) {
    this.authService.pageTitle.next('Dashboard');
    this.callRouteLoad();
    this.getFirstLoad();
    this.dashboardEps.cardDataSubject.subscribe((data:any)=>{
      this.incomingCardData=data?.incoming;
      this.missedCardData=data?.missed;
      this.answeredCardData=data?.answered;
    })
    
    this.dashboardEps.chartDataSubject.subscribe((data:any)=>{
      console.log(data)
      this.barChartData=data?.incoming;
    })
  }

  callRouteLoad()
  {
    this.commonEps.getLocations().then(data=>{
      this.countries=data;
    })
    this.commonEps.getLanguages().then(data=>{
      this.languauges=data;
    })
    this.dashboardEps.getCarddata();

  }
  getFirstLoad()
  {
    this.sharedRes.LoadcommonEpsubject.subscribe(data=>{
      if(data==1)
      {
        this.commonEps.getLocations().then(data=>{
          this.countries=data;
        })
        this.commonEps.getLanguages().then(data=>{
          this.languauges=data;
          this.dashboardEps.getCarddata();
          this.dashboardEps.getChartData();
        })
     
      }
    })
  }
}
