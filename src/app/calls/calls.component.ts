/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { callType, languauges, searchInputData } from './callsData';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { callsIndicatorData } from '../models/callIndicatorModel';
import { CallsService } from './callService/calls.service';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  callType = callType;
  languauges = languauges;
  searchInputData = searchInputData;
  showIndicator = false;
  callsIndicatorData = {};
  showCalender = false;
  selectedPage: string = 'incoming';
  languageIds: number[] = [];
  callTypeName: string[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private CommonService: CommonService,
    private CallsService: CallsService
  ) {
    this.authService.pageTitle.next('Calls');
  }

  ngOnInit() {
    this.callInitialEndpoints();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child: any = this.activatedRoute.firstChild;
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return child.snapshot.routeConfig.path;
        })
      )
      .subscribe(async (ttl: string) => {
        this.selectedPage = ttl;
        if (ttl === 'missed') {
          this.showIndicator = true;
          const callIndicator: callsIndicatorData = {
            text: '11 missed requests',
            icon: '../assets/images/components/calls_count_missed.svg',
            backgroundColor: '#F4CAD6',
            borderColor: '1px solid #F4CAD6',
            textColor: '#FF155A'
          };
          this.callsIndicatorData = callIndicator;
          this.showCalender = true;
        } else if (ttl === 'answered') {
          this.showIndicator = true;
          const callIndicator: callsIndicatorData = {
            text: '11 missed requests',
            icon: '../assets/images/components/calls_count_answered.svg',
            backgroundColor: '#EBF6DD',
            borderColor: '1px solid #C1E297',
            textColor: '#76CB09'
          };
          this.callsIndicatorData = callIndicator;
          this.showCalender = true;
        } else if (ttl === 'incoming') {
        } else if (ttl === 'ongoing') {
        } else {
          this.showIndicator = false;
          this.showCalender = false;
        }
      });
  }

  private async callInitialEndpoints() {
    this.languauges = await this.CommonService.getLanguages();
  }
  public languaugesOutput(languageOutput: number[]) {
    this.languageIds = languageOutput;
    this.CallsService.callQueueSocketByLanguageandCall(
      languageOutput,
      this.callTypeName,
      this.selectedPage
    );
  }
  public callOutput(callTypeOutput: any) {
    const callType: string[] = this.CallsService.getCallTypeId(callTypeOutput);
    this.callTypeName = callType;
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      callType,
      this.selectedPage
    );
  }
}
