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
  newCallModelMissed,
  OngoingCallModel
} from '../models/callModel';
import { AgentUserInformation } from '../workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { OverlayService } from '../callInterface/overLayService/overlay.service';

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
  selectedPage!: string;
  languageIds: number[] = [];
  callTypeName: string[] = [];
  startDate: string = '';
  endDate: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private CallsService: CallsService,
    private calendarService: CalendarService,
    private QueueSocketService: QueueSocketService,
    private AgentUserInformation: AgentUserInformation,
    private OverlayService: OverlayService,


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
    this.QueueSocketService.SendDefaultParam();
    this.QueueSocketService.SendDefaultParamFinished();
    this.route.url.subscribe(() => {
      const tabName: string =
        this.route.snapshot.firstChild?.routeConfig?.path || '';
      this.selectedPage = tabName;
      this.callSegmentSelection(tabName);
    });

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
      .subscribe((title: string) => {
        this.selectedPage = title;
        this.callSegmentSelection(title);
      });
    this.QueueSocketService.callDataSubject.subscribe((data: any) => {
      this.callSegmentSelection(data.type)

    });

  }

  callSegmentSelection(title: string) {
    const data = this.QueueSocketService.defaultCallData;
    if (title === 'missed') {
      this.CallsService.sendDatatoMissedAndAnswered(data.missed, title);
    } else if (title === 'finished') {
      this.CallsService.sendDatatoMissedAndAnswered(data.finished, title);
    } else if (title === 'incoming') {
      this.CallsService.sendDataToTabs(data.incoming, title);
    } else if (title === 'ongoing') {
      this.CallsService.sendDataToTabs(data.ongoing, title);
    }
  }
}
