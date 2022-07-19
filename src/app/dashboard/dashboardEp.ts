import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ChartsData } from "../chartsfunction/chart.data";
import { ChartLabel } from "../chartsfunction/chart.label";
import { commonEps } from "../commonEps/commonEps";
import { Card } from "../models/card";
import { GigaaaApiService } from "../services/gigaaaApiService";
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root'
})

export class DashboardEps  {
  icomingIcon= '../../assets/images/components/calls_incoming.svg';
  missedIcon= '../../assets/images/components/calls_count_missed.svg';
  answeredIcon='../../assets/images/components/calls_count_answered.svg';

  cardDataSubject= new Subject();
  chartDataSubject=new Subject();
    constructor(private GigaaaApiService:GigaaaApiService,
      private commoneps:commonEps,
      private chartLabel:ChartLabel,
      private chartsData:ChartsData)
    {
       
        
    }
    // call the cards count endpoint for 
    public   getCarddata()
    {      
                const   epParams= this.commoneps.getEpsParamLocal();
                this.GigaaaApiService.getcallstatistics(epParams.token,
                epParams.organization,
                epParams.project,
                "this_week",this.commoneps.getIdsofLanguage(),this.commoneps.getIdsOfLocation()).subscribe((data:any)=>{
               // cards data calcultation
                const incomingCard=data['incoming'].count;
                const percencateIncomingCard=this.getpercentagecalculated(data['incoming'].increase);
                const missedCard=data['missed'].count;
                const percencateMissedCard=this.getpercentagecalculated(data['missed'].increase);
                const answeredCard=data['answered'].count;
                const percencateAwnseredCard=this.getpercentagecalculated(data['answered'].increase);
               // cards model data
                const incomingCardRes= this.fillDashboardCardData(this.icomingIcon,"Total Incoming","#EDEDF6",incomingCard," % vs Last week",percencateIncomingCard)
                const missedCardRes= this.fillDashboardCardData(this.missedIcon,"Total Missed","#F9EBEF",missedCard," % vs Last week",percencateMissedCard)
                const answeredCardRes= this.fillDashboardCardData(this.answeredIcon,"Total Answered","#EBF7DD",answeredCard," % vs Last week",percencateAwnseredCard)
                const finalCardsData={incoming:incomingCardRes,missed:missedCardRes,answered:answeredCardRes} ; 
                this.cardDataSubject.next(finalCardsData); 
            })
    }

    // calculate percencate of cards value 
   private  getpercentagecalculated(val:number)
   {
    let  calculated:any;
    if(val!=null)
    {
      calculated=(val*100).toFixed(2);
      if(calculated>0)
      {
        return calculated;
      }
      else{     
        return calculated;
      }
    }
    else{
        return 0;
     }
     }
     // fill dashboard card data 

    private fillDashboardCardData(urls:string,title:string,color:string,mainResult:string,secondResultText:string,secondResultNumber:number)
     {
      const cardDataTotalVisitors: Card = {
        icon: urls,
        title: title,
        color: color,
        mainResult:mainResult,
        secondResultText: secondResultText,
        secondResultNumber:secondResultNumber,
        iconUp: '../../assets/images/cards/arrowUp.svg',
        iconDown: '../../assets/images/cards/arrowDown.svg'
      };
      return cardDataTotalVisitors;
     }
    
     // call the charts  endpoint f
     public getChartData()
     {
      const   epParams= this.commoneps.getEpsParamLocal();
      this.GigaaaApiService.getcallchart(epParams.token,
      epParams.organization,
      epParams.project,
      "this_week",this.commoneps.getIdsofLanguage(),
      this.commoneps.getIdsOfLocation(),
      "2022-07-18","2022-07-24").subscribe((data:any)=>{
        const incomingLabel=this.chartLabel.caculateChartLabels(data['incoming'],"this_week",data?.num_bars);
        const missedLabel=this.chartLabel.caculateChartLabels(data['missed'],"this_week",data?.num_bars)
        const answeredLabel=this.chartLabel.caculateChartLabels(data['answered'],"this_week",data?.num_bars)
        
        const incomingData=this.chartsData.calculateChartData(data['incoming']);
        const imissedData=this.chartsData.calculateChartData(data['missed']);
        const answeredData=this.chartsData.calculateChartData(data['missed']);
       const incomingChartRes=this.chartDataForm(incomingData,incomingLabel);
       const missedChartRes=this.chartDataForm(imissedData,missedLabel);
       const answeredChartRes=this.chartDataForm(answeredData,answeredLabel);
        
       const groupChart={inmcoming:incomingChartRes,missed:missedChartRes,answered:answeredChartRes} 

        this.chartDataSubject.next(groupChart);
       })
     }


     private chartDataForm(chartData:Array<any>,chartLebel:Array<any>)
     {
     const  ChartDataSet: ChartData<'bar'> = {
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
