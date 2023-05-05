/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { Subject } from 'rxjs';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { ChartLabel } from 'src/app/chartsfunction/chartLabel';
import { ChartsData } from 'src/app/chartsfunction/chartData';
import { AnalyticsSocketService } from 'src/app/workdeskSockets/analyticsSocket/analytics-socket.service';
import { Router } from '@angular/router';
import { Card, cardTypeModel } from 'src/app/models/card';
import { chartModel } from 'src/app/models/chartModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardEndpointService {
  icomingIcon = '../../assets/images/components/calls_incoming.svg';
  missedIcon = '../../assets/images/components/total_missed.svg';
  answeredIcon = '../../assets/images/components/total_answered.svg';


  selectedRange = 'this_week'
  cardDataSubject = new Subject<cardTypeModel>();
  chartDataSubject = new Subject<chartModel>();
  constructor(
    private chartLabel: ChartLabel,
    private chartsData: ChartsData,
    private calanderService: CalendarService,
    private AnalyticsSocketService: AnalyticsSocketService,
    private Router: Router
  ) {
    this.getAnalyticsDataObjectSocket();
  }

  // get Analytics charts
  getAnalyticsDataObjectSocket() {
    this.AnalyticsSocketService.AnalyticsBarChartSubject.subscribe(data => {
      const incomingLabel = this.chartLabel.caculateChartLabels(
        data.incoming,
        this.selectedRange,
        data?.num_bars
      );
      const missedLabel = this.chartLabel.caculateChartLabels(
        data.missed,
        this.selectedRange,
        data?.num_bars
      );
      const answeredLabel = this.chartLabel.caculateChartLabels(
        data.answered,
        this.selectedRange,
        data?.num_bars
      );

      const incomingData = this.chartsData.calculateChartData(
        data.incoming
      );
      const imissedData = this.chartsData.calculateChartData(data.missed);
      const answeredData = this.chartsData.calculateChartData(
        data.answered
      );
      const incomingChartRes: ChartData<'bar'> = this.chartDataForm(
        incomingData,
        incomingLabel
      );
      const missedChartRes: ChartData<'bar'> = this.chartDataForm(
        imissedData,
        missedLabel
      );
      const answeredChartRes: ChartData<'bar'> = this.chartDataForm(
        answeredData,
        answeredLabel
      );

      const groupChart: ChartData<'bar'>[] = [
        incomingChartRes,
        missedChartRes,
        answeredChartRes
      ];
      const finalChart: chartModel = {
        type: data.type,
        data: groupChart
      }
      this.chartDataSubject.next(finalChart);
    });
    // for cards data
    this.AnalyticsSocketService.AnalyticsCardSubject.subscribe(data => {
      // cards data calcultation
      const incomingCard = data.incoming.count;
      const percencateIncomingCard = this.getpercentagecalculated(
        data.incoming.increase
      );
      const missedCard = data.missed.count;
      const percencateMissedCard = this.getpercentagecalculated(
        data.missed.increase
      );
      const answeredCard = data.answered.count;
      const percencateAwnseredCard = this.getpercentagecalculated(
        data.answered.increase
      );
      const relatedDateRange = this.calanderService.getRelatedDateRange(this.selectedRange);
      // cards model data
      const incomingCardRes = this.fillDashboardCardData(
        this.icomingIcon,
        'Total Incoming',
        '#EDEDF6',
        incomingCard,
        relatedDateRange,
        percencateIncomingCard
      );
      const missedCardRes = this.fillDashboardCardData(
        this.missedIcon,
        'Total Missed',
        '#F9EBEF',
        missedCard,
        relatedDateRange,
        percencateMissedCard
      );
      const answeredCardRes = this.fillDashboardCardData(
        this.answeredIcon,
        'Total Answered',
        '#EBF7DD',
        answeredCard,
        relatedDateRange,
        percencateAwnseredCard
      );
      const finalCardsData = [
        incomingCardRes,
        missedCardRes,
        answeredCardRes
      ];
      const card: cardTypeModel = {
        type: data.type,
        data: finalCardsData
      }
      this.cardDataSubject.next(card);
    })
  }
  // call the cards count endpoint for
  public getAnalyticsData(
    languages: Array<number>,
    location: Array<number>,
    selectedRange: string,
    type: string
  ) {
    this.selectedRange = selectedRange;
    this.AnalyticsSocketService.sendAnalyticssParameter({
      time_range: selectedRange,
      countries: location,
      languages: languages,
      type: type
    })
  }

  // calculate percencate of cards value
  private getpercentagecalculated(val: number) {
    let calculated: any;
    if (val != null) {
      calculated = (val * 100).toFixed(2);
      return calculated;
    } else {
      return 0;
    }
  }
  // fill dashboard card data

  private fillDashboardCardData(
    urls: string,
    title: string,
    color: string,
    mainResult: number,
    secondResultText: string,
    secondResultNumber: number
  ) {
    const cardResult: Card = {
      icon: urls,
      title: title,
      color: color,
      mainResult: mainResult,
      secondResultText:
        secondResultText === '' ? '' : ' % vs ' + secondResultText,
      secondResultNumber: secondResultText === '' ? 0 : secondResultNumber,
      iconUp:
        secondResultText === '' ? '' : '../../assets/images/cards/arrowUp.svg',
      iconDown:
        secondResultText === '' ? '' : '../../assets/images/cards/arrowDown.svg'
    };
    return cardResult;
  }
  private chartDataForm(chartData: Array<any>, chartLebel: Array<any>) {
    const ChartDataSet: ChartData<'bar'> = {
      labels: chartLebel,

      datasets: [
        {
          data: chartData,
          backgroundColor: ['#1C54DB'],
          hoverBackgroundColor: ['#1C54DB'],
          borderRadius: 4,
          maxBarThickness: 65,
          hoverBorderColor: '#1C54DB'
        }
      ]
    };
    return ChartDataSet;
  }


}