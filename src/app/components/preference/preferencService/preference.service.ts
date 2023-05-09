import { Injectable } from '@angular/core';
import { SplittedTimeModel, tickerModel, tickers, timer } from 'src/app/models/preferenceModel';
import { RequestTimeModel } from 'src/app/models/settings';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { waitTimeData, userWaitTimeData, chatWaitTimeData } from '../preferenceData';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  waitTimeData = waitTimeData
  userWaitTimeData = userWaitTimeData
  chatWaitTimeData = chatWaitTimeData
  constructor(private MessageService: MessageService, private GigaaaApiService: GigaaaApiService, private commonService: CommonService) { }
  async getDefaultTime() {
    const requestWaitData: RequestTimeModel = await this.GigaaaApiService.getDefaultRequestTime(this.commonService.getEndpointsParamLocal().token,
      this.commonService.getEndpointsParamLocal().organization, this.commonService.getEndpointsParamLocal().project)
    const callWaitTime = this.commonService.toHoursAndMinutes(requestWaitData.call_wait_time)
    const userWaitTime = this.commonService.toHoursAndMinutes(requestWaitData.user_wait_time)
    const chatWaitTime = this.commonService.toHoursAndMinutes(requestWaitData.chat_wait_time)
    // const data = [{ type: 'call', time: callWaitTime }, { type: 'user', time: userWaitTime }, { type: 'chat', time: chatWaitTime }];
    this.defaultOperation({ type: 'call', time: callWaitTime });
    this.defaultOperation({ type: 'user', time: userWaitTime });
    this.defaultOperation({ type: 'chat', time: chatWaitTime });
  }


  // set default Values 
  defaultOperation(SplittedTimeModel: SplittedTimeModel) {
    switch (SplittedTimeModel.type) {
      case 'call':
        this.waitTimeData.tickers = this.setDefaultOperation(SplittedTimeModel.time, waitTimeData)
        break;
      case 'user':
        this.userWaitTimeData.tickers = this.setDefaultOperation(SplittedTimeModel.time, userWaitTimeData)
        break;
      case 'chat':
        this.chatWaitTimeData.tickers = this.setDefaultOperation(SplittedTimeModel.time, chatWaitTimeData)
        break;

    }
  }

  setDefaultOperation(timer: timer, tickerModel: tickerModel): tickers[] {
    switch (tickerModel.tickers.length) {
      case 2:
        tickerModel.tickers[1].header === 'sec' ? tickerModel.tickers[1].value = timer.sec : ''
        tickerModel.tickers[0].header === 'min' ? tickerModel.tickers[0].value = timer.min : ''
        return tickerModel.tickers;
      case 3:
        tickerModel.tickers[2].header === 'sec' ? tickerModel.tickers[2].value = timer.sec : ''
        tickerModel.tickers[1].header === 'min' ? tickerModel.tickers[1].value = timer.min : ''
        tickerModel.tickers[0].header === 'h' ? tickerModel.tickers[0].value = timer.h : ''
        return tickerModel.tickers;
      default:
        return tickerModel.tickers;
    }
  }


  public async updateDefaultTimes(callWaitTime: number, userWaitTime: number, chatWaitime: number) {
    try {
      await this.GigaaaApiService.setDefaultRequestTime(this.commonService.getEndpointsParamLocal().token,
        this.commonService.getEndpointsParamLocal().organization, this.commonService.getEndpointsParamLocal().project, callWaitTime, userWaitTime, chatWaitime)
      this.MessageService.setSuccessMessage('Updated');
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error);
    }

  }
}
