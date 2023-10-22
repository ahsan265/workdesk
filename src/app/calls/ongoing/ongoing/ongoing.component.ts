import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { noAgentTobaleData } from 'src/app/agents/agentsData';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { ranges } from 'src/app/dashboard/dashboardData';
import {
  OngoingCallModelTable,
  newCallModelOngoing
} from 'src/app/models/callModel';
import { MultiSelect } from 'src/app/models/multiSelect';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { CallsService } from '../../callService/calls.service';
import { getDefaultInputsLoadOnce } from '../../defaultLoadService/incoming.Service';
import {
  callTypeOngoing,
  languaugesOngoing,
  ongoingTableSetting,
  searchInputData
} from '../../ongoing/ongoingData';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss']
})
export class OngoingComponent implements OnInit {
  nodata = noAgentTobaleData;
  showCalender = false;
  ongoingData: OngoingCallModelTable[] = [];
  unfilterOngoingData: OngoingCallModelTable[] = [];
  tableSettings = ongoingTableSetting;
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
  callType = callTypeOngoing;
  languauges!: MultiSelect;
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
    private CallsSrvice: CallsService,
    private CommonService: CommonService,
    private calendarService: CalendarService,
    private getDefaultInputsLoadOnce: getDefaultInputsLoadOnce
  ) {
    this.CallsSrvice.sendDataToOngoingTabsSubject.subscribe(
      (data: newCallModelOngoing) => {
        this.ongoingData = data.calls.map((answeredData) => ({
          user_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: answeredData.user_name
          },
          utilites: [
            {
              image: this.CommonService.getLanguageFlags(
                answeredData.language_id
              )
            },
            { image: this.CommonService.getBrowserFlag(answeredData.browser) },
            {
              image: this.CommonService.getDeviceType(answeredData.desktop)
            },
            {
              image: this.CommonService.getOperatingSystem(
                answeredData.operating_system
              )
            }
          ],
          callType: {
            image: this.CommonService.getConversationType(
              answeredData.request_type
            ),
            text: this.CallsSrvice.getCallTypeName(answeredData.request_type)
          },
          call_uuid: answeredData.request_uuid,
          duration: answeredData.request_started_at,
          agent_name: answeredData.agent.display_name,
          user_id: this.CallsSrvice.getUserId(answeredData.user_id),
          agent_details: {
            image: answeredData.agent.images[96],
            text: answeredData.agent.email
          }
        }));
        this.unfilterOngoingData = this.ongoingData;
      }
    );
  }
  async ngOnInit(): Promise<void> {
    this.getDefaultInputsLoadOnce.ongoingLangauge
      .asObservable()
      .subscribe((data) => {
        this.languauges = data;
        this.languageIds = [];
        this.callTypeName = [];
        this.callType.data.map((data) => {
          data.selected = false;
        });
        this.searchInputData.searchText = '';
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
    this.CallsSrvice.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'ongoing',
      this.aggregate
    );
  }

  public callOutput(callTypeOutput: any) {
    this.callTypeName = this.CallsSrvice.getCallTypeId(callTypeOutput);
    this.CallsSrvice.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'ongoing',
      this.aggregate
    );
  }

  public languaugesOutput(languageOutput: number[]) {
    this.languageIds = languageOutput;
    this.CallsSrvice.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'ongoing',
      this.aggregate
    );
  }
  // get ongoing data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    this.ongoingData = this.CallsSrvice.search(
      value,
      this.ongoingData,
      this.unfilterOngoingData
    );
    if (value.length === 0 && this.ongoingData.length === 0) {
      this.ongoingData = this.unfilterOngoingData;
    }
  }
}
