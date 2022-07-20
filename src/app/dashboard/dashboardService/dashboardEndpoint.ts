import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ChartsData } from "../../chartsfunction/chartData";
import { ChartLabel } from "../../chartsfunction/chartLabel";
import { CommonEndpoints } from "../../commonEndpoints/commonEndpoint";
import { Card } from "../../models/card";
import { ChartData } from 'chart.js';
import { OneSelect } from "../../models/oneSelect";
import { GigaaaApiService } from "../../workdeskServices/gigaaaApiService/gigaaa-api-service.service";

@Injectable({
  providedIn: 'root'
})

export class DashboardEps {
  icomingIcon = '../../assets/images/components/calls_incoming.svg';
  missedIcon = '../../assets/images/components/calls_count_missed.svg';
  answeredIcon = '../../assets/images/components/calls_count_answered.svg';

  cardDataSubject = new Subject();
  chartDataSubject = new Subject();
  constructor(private GigaaaApiService: GigaaaApiService,
    private commoneps: CommonEndpoints,
    private chartLabel: ChartLabel,
    private chartsData: ChartsData) {


  }
  // call the cards count endpoint for 
  public getCarddata(languages: Array<OneSelect>, location: Array<OneSelect>) {
    const epParams = this.commoneps.getEpsParamLocal();
    this.GigaaaApiService.getcallstatistics(epParams.token,
      epParams.organization,
      epParams.project,
      "this_week", languages, location).subscribe((data: any) => {
        // cards data calcultation
        const incomingCard = data['incoming'].count;
        const percencateIncomingCard = this.getpercentagecalculated(data['incoming'].increase);
        const missedCard = data['missed'].count;
        const percencateMissedCard = this.getpercentagecalculated(data['missed'].increase);
        const answeredCard = data['answered'].count;
        const percencateAwnseredCard = this.getpercentagecalculated(data['answered'].increase);
        // cards model data
        const incomingCardRes = this.fillDashboardCardData(this.icomingIcon, "Total Incoming", "#EDEDF6", incomingCard, " % vs Last week", percencateIncomingCard)
        const missedCardRes = this.fillDashboardCardData(this.missedIcon, "Total Missed", "#F9EBEF", missedCard, " % vs Last week", percencateMissedCard)
        const answeredCardRes = this.fillDashboardCardData(this.answeredIcon, "Total Answered", "#EBF7DD", answeredCard, " % vs Last week", percencateAwnseredCard)
        const finalCardsData = { incoming: incomingCardRes, missed: missedCardRes, answered: answeredCardRes };
        this.cardDataSubject.next(finalCardsData);
      })
  }

  // calculate percencate of cards value 
  private getpercentagecalculated(val: number) {
    let calculated: any;
    if (val != null) {
      calculated = (val * 100).toFixed(2);
      return calculated;
    }
    else {
      return 0;
    }
  }
  // fill dashboard card data 

  private fillDashboardCardData(urls: string, title: string, color: string, mainResult: string, secondResultText: string, secondResultNumber: number) {
    const cardResult: Card = {
      icon: urls,
      title: title,
      color: color,
      mainResult: mainResult,
      secondResultText: secondResultText,
      secondResultNumber: secondResultNumber,
      iconUp: '../../assets/images/cards/arrowUp.svg',
      iconDown: '../../assets/images/cards/arrowDown.svg'
    };
    return cardResult;
  }

  // call the charts  endpoint f
  public getChartData(languages: Array<OneSelect>, locations: Array<OneSelect>) {
    const epParams = this.commoneps.getEpsParamLocal();
    this.GigaaaApiService.getcallchart(epParams.token,
      epParams.organization,
      epParams.project,
      "this_week", languages,
      locations,
      "2022-07-18", "2022-07-24").subscribe((data: any) => {
        const incomingLabel = this.chartLabel.caculateChartLabels(data['incoming'], "this_week", data?.num_bars);
        const missedLabel = this.chartLabel.caculateChartLabels(data['missed'], "this_week", data?.num_bars)
        const answeredLabel = this.chartLabel.caculateChartLabels(data['answered'], "this_week", data?.num_bars)

        const incomingData = this.chartsData.calculateChartData(data['incoming']);
        const imissedData = this.chartsData.calculateChartData(data['missed']);
        const answeredData = this.chartsData.calculateChartData(data['missed']);
        const incomingChartRes: ChartData<'bar'> = this.chartDataForm(incomingData, incomingLabel);
        const missedChartRes: ChartData<'bar'> = this.chartDataForm(imissedData, missedLabel);
        const answeredChartRes: ChartData<'bar'> = this.chartDataForm(answeredData, answeredLabel);

        const groupChart = { inmcoming: incomingChartRes, missed: missedChartRes, answered: answeredChartRes }
        this.chartDataSubject.next(groupChart);
      })
  }


  private chartDataForm(chartData: Array<any>, chartLebel: Array<any>) {
    const ChartDataSet: ChartData<'bar'> = {
      labels: chartLebel,

      datasets: [
        {
          data: chartData,
          backgroundColor: ['#1C54DB'],
          hoverBackgroundColor: ['#1C54DB'],
          borderRadius: 10
        }
      ]
    };
    return ChartDataSet;
  }


}
