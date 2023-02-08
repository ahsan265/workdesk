import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GigaaaDaterangepickerDirective, OverlayService } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { noAgentTobaleData } from 'src/app/agents/agentsData';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { CallConsoleComponent } from 'src/app/callInterface/call-console/call-console.component';
import { noTobaleData } from 'src/app/components/no-table-data/notableData';
import { ranges } from 'src/app/dashboard/dashboardData';
import {
  IncomingCallModelTable,
  newCallModelIncoming
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { languaugesIncoming, searchInputData } from '../../callsData';
import { CallsService } from '../../callService/calls.service';
import { getDefaultInputsLoadOnce } from '../../defaultLoadService/incoming.Service';
import { callTypeIncoming, incomingTableSetting } from '../../defaultLoadService/incomingData';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss'],

})
export class IncomingComponent implements OnInit {
  nodata = noAgentTobaleData;
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
  languauges = languaugesIncoming;
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
    private calendarService: CalendarService,
    private AgentSocketService: AgentSocketService,
    private CallsService: CallsService,
    private getDefaultInputsLoadOnce: getDefaultInputsLoadOnce
  ) {
    this.CallsService.sendDataToIncomingTabsSubject.subscribe(
      (data: newCallModelIncoming) => {
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
          disableButton: (incomingData.on_hold === true || this.AgentSocketService.isInCall === true) ? true : false

        }));
        this.unfilterIncomingData = this.incomingData;
      }
    );
  }
  async ngOnInit(): Promise<void> {
    this.getDefaultInputsLoadOnce.incominglanguages.asObservable().subscribe(data => {
      this.languauges = data;
      this.languageIds=[];
      this.callTypeName=[];
      this.callType.data.map(data=>{
        data.selected=false;
      })
      this.searchInputData.searchText='';
    });
  }

  async getCallsId(event: any) {
    let data = { call_uuid: event.call_uuid };
    // await this.GigaaaApiService.getcalltype(
    //   this.CommonService.getEndpointsParamLocal().token,
    //   this.CommonService.getEndpointsParamLocal().organization,
    //   this.CommonService.getEndpointsParamLocal().project,
    //   data
    // );
    this.OverlayService.open({
      component:CallConsoleComponent,
      data: event,
      panelClass:'dialog-panel',
      isPopup:false
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
