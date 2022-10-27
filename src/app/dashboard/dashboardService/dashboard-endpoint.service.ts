/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { Card } from '@gigaaa/gigaaa-components/lib/models/card';
import { OneSelect } from '@gigaaa/gigaaa-components/lib/models/oneSelect';
import { ChartData } from 'chart.js';
import { Subject } from 'rxjs';
import { ChartsData } from 'src/app/chartsFunction/chartData';
import { ChartLabel } from 'src/app/chartsFunction/chartLabel';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardEndpointService {
  icomingIcon = '../../assets/images/components/calls_incoming.svg';
  missedIcon = '../../assets/images/components/total_missed.svg';
  answeredIcon = '../../assets/images/components/total_answered.svg';

  cardDataSubject = new Subject();
  chartDataSubject = new Subject<ChartData<'bar'>[]>();
  constructor(
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private chartLabel: ChartLabel,
    private chartsData: ChartsData,
    private calanderService: CalendarService,
    private MessageService: MessageService
  ) { }
  // call the cards count endpoint for
  public getCarddata(
    languages: Array<OneSelect>,
    location: Array<OneSelect>,
    selectedRange: string
  ) {
    const epParams = this.CommonService.getEndpointsParamLocal();
    this.GigaaaApiService.getcallstatistics(
      epParams.token,
      epParams.organization,
      epParams.project,
      selectedRange,
      languages,
      location
    ).subscribe(
      (data: any) => {
        // cards data calcultation
        const incomingCard = data['incoming'].count;
        const percencateIncomingCard = this.getpercentagecalculated(
          data['incoming'].increase
        );
        const missedCard = data['missed'].count;
        const percencateMissedCard = this.getpercentagecalculated(
          data['missed'].increase
        );
        const answeredCard = data['answered'].count;
        const percencateAwnseredCard = this.getpercentagecalculated(
          data['answered'].increase
        );
        const relatedDateRange =
          this.calanderService.getRelatedDateRange(selectedRange);
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
        const finalCardsData = {
          incoming: incomingCardRes,
          missed: missedCardRes,
          answered: answeredCardRes
        };
        this.cardDataSubject.next(finalCardsData);
      },
      (err: any) => {
        this.MessageService.setErrorMessage(err.error.error);
      }
    );
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
    mainResult: string,
    secondResultText: string,
    secondResultNumber: number
  ) {

    const cardResult: Card = {
      icon: urls,
      title: title,
      color: color,
      mainResult: mainResult,
      secondResultText: (secondResultText === "") ? "" : ' % vs ' + secondResultText,
      secondResultNumber: (secondResultText === "") ? 0 : secondResultNumber,
      iconUp: (secondResultText === "") ? "" : '../../assets/images/cards/arrowUp.svg',
      iconDown: (secondResultText === "") ? "" : '../../assets/images/cards/arrowDown.svg'
    };
    return cardResult;
  }

  // call the charts  endpoint f
  public getChartData(
    languages: Array<OneSelect>,
    locations: Array<OneSelect>,
    selectedRange: string,
    startDate: string,
    endDate: string
  ) {
    const epParams = this.CommonService.getEndpointsParamLocal();
    this.GigaaaApiService.getcallchart(
      epParams.token,
      epParams.organization,
      epParams.project,
      selectedRange,
      languages,
      locations,
      startDate,
      endDate
    ).subscribe(
      (data: any) => {
        const incomingLabel = this.chartLabel.caculateChartLabels(
          data['incoming'],
          selectedRange,
          data?.num_bars
        );
        const missedLabel = this.chartLabel.caculateChartLabels(
          data['missed'],
          selectedRange,
          data?.num_bars
        );
        const answeredLabel = this.chartLabel.caculateChartLabels(
          data['answered'],
          selectedRange,
          data?.num_bars
        );

        const incomingData = this.chartsData.calculateChartData(
          data['incoming']
        );
        const imissedData = this.chartsData.calculateChartData(data['missed']);
        const answeredData = this.chartsData.calculateChartData(data['answered']);
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
        this.chartDataSubject.next(groupChart);
      },
      (err: any) => {
        this.MessageService.setErrorMessage(err.error.error);
      }
    );
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
          hoverBorderColor: '#1C54DB',
        }
      ],
    };
    return ChartDataSet;
  }
}
