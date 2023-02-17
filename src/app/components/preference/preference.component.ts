import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { allLanguageData, languauges } from './preferenceData';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent {
  languauges = languauges;
  allLanguageData = allLanguageData;

  constructor(private authService: AuthService) {
    this.authService.pageTitle.next('Preference');
  }

  langugaOutput(event: number) {
    console.log(event)
  }
  onGetSwitchAllLanguage(event: any) {

  }
}
