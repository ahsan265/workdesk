import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CanloadService } from 'src/app/services/canLoad/canload.service';
import { allLanguageData, chatWaitTimeData, languauges, userWaitTimeData, waitTimeData } from './preferenceData';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
  languauges = languauges;
  allLanguageData = allLanguageData;
  waitTimeData = waitTimeData
  userWaitTimeData = userWaitTimeData
  chatWaitTimeData = chatWaitTimeData

  constructor(private authService: AuthService, private CanloadService: CanloadService) {
    this.authService.pageTitle.next('Preferences');
  }

  langugaOutput(event: number) {
  }
  onGetSwitchAllLanguage(event: any) {

  }
  goBack() {
    this.CanloadService.redirectionUserWise();
  }
}
