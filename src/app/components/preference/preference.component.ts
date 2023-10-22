import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CanloadService } from 'src/app/services/canLoad/canload.service';
import {
  allLanguageData,
  chatWaitTimeData,
  languauges,
  userWaitTimeData,
  waitTimeData
} from './preferenceData';
import { PreferenceService } from './preferencService/preference.service';
import { tickerModel } from 'src/app/models/preferenceModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
  languauges = languauges;
  allLanguageData = allLanguageData;
  waitTimeData = waitTimeData;
  userWaitTimeData = userWaitTimeData;
  chatWaitTimeData = chatWaitTimeData;
  callWaitTime: number = 0;
  userWaitTime: number = 0;
  chatWaitTime: number = 0;

  constructor(
    private authService: AuthService,
    private CanloadService: CanloadService,
    private CommonService: CommonService,
    private PreferenceService: PreferenceService
  ) {
    this.authService.pageTitle.next('Preferences');
    this.PreferenceService.getDefaultTime();
    // this.callWaitTime = this.CommonService.toSeconds(0, waitTimeData.tickers[0].value, waitTimeData.tickers[1].value)
    // this.userWaitTime = this.CommonService.toSeconds(0, userWaitTimeData.tickers[0].value, userWaitTimeData.tickers[1].value)
    // this.chatWaitTime = this.CommonService.toSeconds(chatWaitTimeData.tickers[0].value, chatWaitTimeData.tickers[1].value, chatWaitTimeData.tickers[2].value)
    this.PreferenceService.waitingTimes.asObservable().subscribe((data) => {
      this.callWaitTime = data.call_wait_time;
      this.userWaitTime = data.user_wait_time;
      this.chatWaitTime = data.chat_wait_time;
    });
  }

  langugaOutput(event: number) {}
  onGetSwitchAllLanguage(event: any) {}
  goBack() {
    this.CanloadService.redirectionUserWise();
  }
  selectedWidgetOutput(event: tickerModel) {
    switch (event.name) {
      case 'call':
        this.callWaitTime = this.CommonService.toSeconds(
          0,
          event.tickers[0].value,
          event.tickers[1].value
        );
        break;
      case 'user':
        this.userWaitTime = this.CommonService.toSeconds(
          0,
          event.tickers[0].value,
          event.tickers[1].value
        );
        break;
      case 'chat':
        this.chatWaitTime = this.CommonService.toSeconds(
          event.tickers[0].value,
          event.tickers[1].value,
          event.tickers[2].value
        );
        break;
    }
  }

  saveData() {
    this.PreferenceService.updateDefaultTimes(
      this.callWaitTime,
      this.userWaitTime,
      this.chatWaitTime
    );
  }
}
