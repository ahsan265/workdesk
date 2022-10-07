/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { callType, languauges, searchInputData } from './callsData';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { callsIndicatorData } from '../models/callIndicatorModel';
import { CallsService } from './callService/calls.service';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import { ranges } from '../dashboard/dashboardData';
import dayjs from 'dayjs';
import { CalendarService } from '../calendarService/calendar.service';
import { QueueSocketService } from '../workdeskSockets/queueSocket/queue-socket.service';
import {
  AnsweredCallModel,
  CallsModel,
  IncomingCallModel,
  MissedCallModel,
  OngoingCallModel
} from '../models/callModel';
import { MissedComponent } from './missed/missed.component';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss'],
  providers: [CallsService]
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
  startDate: string = '';
  endDate: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private CommonService: CommonService,
    private CallsService: CallsService,
    private calendarService: CalendarService,
    private QueueSocketService: QueueSocketService
  ) {
    this.authService.pageTitle.next('Calls');
    this.alwaysShowCalendars = true;
  }
  ranges = ranges;
  aggregate: string = 'this_week';
  date_from: any = dayjs().startOf('week').add(1, 'day');
  date_to: any = dayjs().endOf('week').add(1, 'day');
  selected: any = {
    startDate: this.date_from,
    endDate: this.date_to,
    aggregate: this.aggregate
  };
  @ViewChild(GigaaaDaterangepickerDirective, { static: false })
  pickerDirective: GigaaaDaterangepickerDirective | undefined;
  alwaysShowCalendars: boolean;
  showCalendar: boolean = false;
  @ViewChild('calendarDropdown') calendar: any = HTMLElement;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.calendar?.nativeElement.contains(event?.target)) {
      this.showCalendar = false;
    }
  }

  incomingData: IncomingCallModel[] = [];
  ongoingData: OngoingCallModel[] = [];
  missedData: MissedCallModel[] = [];
  awnseredData: AnsweredCallModel[] = [];
  ngOnInit() {
    this.route.url.subscribe(() => {
      const tabName: string =
        this.route.snapshot.firstChild?.routeConfig?.path || '';
      this.callSegmentSelection(tabName);
    });
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
      .subscribe(async (title: string) => {
        console.log(title)
        this.selectedPage = title;
        this.callSegmentSelection(title);
      });
    this.QueueSocketService.callDataSubject.subscribe((data: CallsModel) => {
      this.incomingData = data.incoming;
      this.ongoingData = data.ongoing;
      this.missedData = data.missed;
      this.awnseredData = data.finished;
      this.CallsService.sendDataToTabs(data.missed, 'missed');
      this.CallsService.sendDataToTabs(data.finished, 'answered');
      this.CallsService.sendDataToTabs(data.ongoing, 'ongoing');
      this.CallsService.sendDataToTabs(data.incoming, 'incoming');
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

  rangeClicked(event: any) {
    this.aggregate =
      event.label.charAt(0).toLowerCase() +
      event.label.slice(1).replace(/ /g, '_');
    this.startDate = this.calendarService.getDateRangeFormated(
      event.dates[0].$d
    );
    this.endDate = this.calendarService.getDateRangeFormated(event.dates[1].$d);
  }

  change(event: any) {
    if (event.startDate) {
      this.date_from = event.startDate;
      this.date_to = event.endDate.add(1, 'day');
      // Needs to be updated
      let compareArray: any[] = [];
      for (const property in this.ranges) {
        if (
          this.date_from !== this.ranges[property][0] &&
          this.date_to !== this.ranges[property][1]
        ) {
          compareArray.push(this.ranges[property][0]);
        }
      }
      if (compareArray.length === 8) {
        this.aggregate = 'custom';
      }
    }
  }
  onOpenCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  callSegmentSelection(title: string) {
    if (title === 'missed') {
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
      this.CallsService.sendDataToTabs(this.missedData, title);
    } else if (title === 'answered') {
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
      this.CallsService.sendDataToTabs(this.awnseredData, title);
    } else if (title === 'incoming') {
      this.showIndicator = false;
      this.showCalender = false;
      this.CallsService.sendDataToTabs(this.incomingData, title);
    } else if (title === 'ongoing') {
      this.showIndicator = false;
      this.showCalender = false;
      this.CallsService.sendDataToTabs(this.ongoingData, title);
    } else {
      this.showIndicator = false;
      this.showCalender = false;
    }
  }
}
