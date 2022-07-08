/* eslint-disable no-undef */
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Component, ViewChild } from '@angular/core';
import {
  cardDataTotalVisitors,
  countries,
  languauges,
  oneSelectData
} from './dashboardData';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
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

  constructor() {}
}
