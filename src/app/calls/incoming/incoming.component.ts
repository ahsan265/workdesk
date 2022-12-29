import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { OverlayService } from 'src/app/callInterface/overLayService/overlay.service';
import { ranges } from 'src/app/dashboard/dashboardData';
import {
  IncomingCallModel,
  IncomingCallModelTable,
  newCallModelIncoming
} from 'src/app/models/callModel';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { callType, languauges } from '../callsData';
import { CallsService } from '../callService/calls.service';
import { callTypeIncoming, incomingTableSetting, searchInputData } from './incomingData';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss'],

})
export class IncomingComponent implements OnInit {
  showCalender = false;
  tableSettings = incomingTableSetting;
  incomingData: IncomingCallModelTable[] = [];
  unfilterIncomingData: IncomingCallModelTable[] = [];
  lastUsedSearch: string = '';
  startDate: string = '';
  endDate: string = '';
  ranges = ranges;
  aggregate: string = 'this_week';
  date_from: any = dayjs().startOf('week').add(1, 'day');
  date_to: any = dayjs().endOf('week').add(1, 'day');
  selected: any = {
    startDate: this.date_from,
    endDate: this.date_to,
    aggregate: this.aggregate
  };
  callType = callTypeIncoming;
  languauges = languauges;
  searchInputData = searchInputData;
  @ViewChild(GigaaaDaterangepickerDirective, { static: false })
  pickerDirective: GigaaaDaterangepickerDirective | undefined;
  alwaysShowCalendars: boolean | undefined;
  showCalendar: boolean = false;
  languageIds: number[] = [];
  callTypeName: string[] = [];
  @ViewChild('calendarDropdown') calendar: any = HTMLElement;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.calendar?.nativeElement.contains(event?.target)) {
      this.showCalendar = false;
    }
  }
  constructor(
    private CommonService: CommonService,
    private OverlayService: OverlayService,
    private GigaaaApiService: GigaaaApiService,
    private calendarService: CalendarService,
    private AgentSocketService: AgentSocketService,
    private CallsService: CallsService,
  ) {
    this.CallsService.sendDataToIncomingTabsSubject.subscribe(
      (data: newCallModelIncoming) => {
        console.log(data)
        this.incomingData = data.calls.map((incomingData) => ({
          hashIcon: '#',
          call_uuid: incomingData.call_uuid,
          language_icon: '',
          utilites: [
            {
              image: this.CommonService.getLanguageFlags(
                incomingData.language_id
              )
            },
            { image: this.CommonService.getBrowserFlag(incomingData.browser) },
            {
              image: this.CommonService.getDeviceType(incomingData.desktop)
            },
            {
              image: this.CommonService.getOperatingSystem(
                incomingData.operating_system
              )
            }
          ],
          callType: {
            image: this.CommonService.getConversationType(
              incomingData.is_video
            ),
            text: this.CallsService.getCallType(incomingData.is_video)
          },
          name: incomingData.name,
          user_id: this.CallsService.getUserId(incomingData.user_id),
          time: incomingData.waiting_started_at,
          userImage: '../../../assets/images/callInterface/user.png',
          showUserImage: false,
          callPickButton: 'Answer',
          disableButton: this.AgentSocketService.isInCall
        }));
        this.unfilterIncomingData = this.incomingData;
      }
    );
  }
  async ngOnInit(): Promise<void> {
    this.languauges = await this.CommonService.getProjectLanguagesForUser();

  }

  async getCallsId(event: any) {
    let data = { call_uuid: event.call_uuid };
    await this.GigaaaApiService.getcalltype(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      this.CommonService.getEndpointsParamLocal().project,
      data
    );
    this.OverlayService.open({
      data: event
    });
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
  rangeClicked(event: any) {
    this.aggregate =
      event.label.charAt(0).toLowerCase() +
      event.label.slice(1).replace(/ /g, '_');
    this.startDate = this.calendarService.getDateRangeFormated(
      event.dates[0].$d
    );
    this.endDate = this.calendarService.getDateRangeFormated(event.dates[1].$d);
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'incoming',
      this.aggregate
    );
  }

  public callOutput(callTypeOutput: any) {
    this.callTypeName = this.CallsService.getCallTypeId(callTypeOutput);
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'incoming',
      this.aggregate
    );
  }

  public languaugesOutput(languageOutput: number[]) {
    this.languageIds = languageOutput;
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'incoming',
      this.aggregate
    );
  }

  // filter incoming data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    this.incomingData = this.CallsService.search(value, this.incomingData, this.unfilterIncomingData);
    if (value.length === 0 && this.incomingData.length === 0) {
      this.incomingData = this.unfilterIncomingData;
    }
  }
}
