import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { MultiSelect } from 'src/app/models/multiSelect';
import { languaugesAnswered, languaugesIncoming, languaugesMissed, languaugesOngoing } from '../callsData';

@Injectable({
    providedIn: 'root'
})
export class getDefaultInputsLoadOnce {
    incominglanguages: BehaviorSubject<MultiSelect>;
    ongoingLangauge: BehaviorSubject<MultiSelect>;
    missedLanguage: BehaviorSubject<MultiSelect>;
    answeredlanguage: BehaviorSubject<MultiSelect>;

    getLang = new Subject<MultiSelect>();
    constructor(private CommonService: CommonService,
    ) {

        this.incominglanguages = new BehaviorSubject(languaugesIncoming);
        this.ongoingLangauge = new BehaviorSubject(languaugesOngoing);
        this.missedLanguage = new BehaviorSubject(languaugesMissed);
        this.answeredlanguage = new BehaviorSubject(languaugesAnswered);
        this.getUserLangage();
    }
    getUserLangage() {
        this.CommonService.getProjectLanguagesForUser().then((data => {
            this.incominglanguages.next(data);
        }))
        this.CommonService.getProjectLanguagesForUser().then((data => {
            this.ongoingLangauge.next(data);
        }))
        this.CommonService.getProjectLanguagesForUser().then((data => {
            this.missedLanguage.next(data);
        }))
        this.CommonService.getProjectLanguagesForUser().then((data => {
            this.answeredlanguage.next(data);
        }))
    }
}
