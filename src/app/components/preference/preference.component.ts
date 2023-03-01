import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OneSelect } from 'src/app/models/oneSelect';
import { AuthService } from 'src/app/services/auth.service';
import { CanloadService } from 'src/app/services/canLoad/canload.service';
import { allLanguageData, languauges } from './preferenceData';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
  languauges = languauges;
  allLanguageData = allLanguageData;

  constructor(private authService: AuthService, private CanloadService: CanloadService) {
    this.authService.pageTitle.next('Preferences');
  }

  langugaOutput(event: OneSelect) {
  }
  onGetSwitchAllLanguage(event: any) {

  }
  goBack() {
    this.CanloadService.redirectionUserWise();
  }
}
