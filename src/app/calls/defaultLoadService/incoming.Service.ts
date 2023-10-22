import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { MultiSelect } from 'src/app/models/multiSelect';
import { languaugesIncoming } from '../callsData';
import { languaugesOngoing } from '../ongoing/ongoingData';
import { languaugesMissed } from '../missed/missedData';
import {
  dataTableSettings,
  languaugesAnswered
} from '../answered/answeredData';

@Injectable({
  providedIn: 'root'
})
export class getDefaultInputsLoadOnce {
  incominglanguages: BehaviorSubject<MultiSelect>;
  ongoingLangauge: BehaviorSubject<MultiSelect>;
  missedLanguage: BehaviorSubject<MultiSelect>;
  answeredlanguage: BehaviorSubject<MultiSelect>;
  constructor(private CommonService: CommonService) {
    this.incominglanguages = new BehaviorSubject(languaugesIncoming);
    this.ongoingLangauge = new BehaviorSubject(languaugesMissed);
    this.missedLanguage = new BehaviorSubject(languaugesAnswered);
    this.answeredlanguage = new BehaviorSubject(languaugesAnswered);
    this.getUserLangage();
  }
  async getUserLangage() {
    this.CommonService.getProjectLanguagesForUser().then((data) => {
      this.incominglanguages.next(data);
    });
    this.CommonService.getProjectLanguagesForUser().then((data) => {
      this.ongoingLangauge.next(data);
    });
    this.CommonService.getProjectLanguagesForUser().then((data) => {
      this.missedLanguage.next(data);
    });
    this.CommonService.getProjectLanguagesForUser().then((data) => {
      this.answeredlanguage.next(data);
    });
  }
}
