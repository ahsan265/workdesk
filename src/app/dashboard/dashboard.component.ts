/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  oneSelectData = oneSelectData;
  countries = countries;
  languauges = languauges;
  cardDataTotalVisitors = cardDataTotalVisitors;

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
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
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
    private commonEps:commonEps,
    private sharedRes:SharedServices,
    private dashboardEps:DashboardEps) {
    this.authService.pageTitle.next('Dashboard');
  
    
    
  }
  ngOnInit(): void {
    this.commonEpsonLoad();
    this.LoadCommonEPsonFirstLoad();

  }

  // call on route change 
  commonEpsonLoad()
  {
    this.commonEps.getLocations().then(data=>{
      this.countries=data;
     })
     this.commonEps.getLanguages().then(data=>{
       this.languauges=data;
     })
     this.dashboardEps.GetCardCountUsers();
  }
  // load commonEps on first Load
 private  LoadCommonEPsonFirstLoad()
  {
    this.sharedRes.LoadcommonEpsubject.subscribe(trigerrVal=>{
      if(trigerrVal==1)
      { if( this.commonEps.getEpsParamLocal().project!=undefined) 
        {
        this.commonEps.getLocations().then(data=>{
          this.countries=data;
         })
         this.commonEps.getLanguages().then(data=>{
           this.languauges=data;
         })
         this.dashboardEps.GetCardCountUsers();
      }
    }
    })
  
  }
}
