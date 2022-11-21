import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { ranges } from 'src/app/dashboard/dashboardData';
import {
  OngoingCallModel,
  OngoingCallModelTable
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { callType, languauges } from '../callsData';
import { CallsService } from '../callService/calls.service';
import { callTypeOngoing, ongoingTableSetting, searchInputData } from './ongoingData';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss']
})
export class OngoingComponent implements OnInit {
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
    private CallsSrvice: CallsService,
    private CommonService: CommonService,
    private calendarService: CalendarService,

  ) {
    this.CallsSrvice.sendDataToOngoingTabsSubject.subscribe(
      (data: OngoingCallModel[]) => {

        this.ongoingData = data.map((answeredData) => ({
          user_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: answeredData.name
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
              answeredData.is_video
            ),
            text: this.CallsSrvice.getCallType(answeredData.is_video)
          },
          call_uuid: answeredData.call_uuid,
          duration: answeredData.call_started_at,
          agent_name: answeredData.agent.display_name,
          user_id: this.CallsSrvice.getUserId(answeredData.user_id),
          agent_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: answeredData.agent.email
          }
        }));
        this.unfilterOngoingData = this.ongoingData;
      }
    );
  }
  async ngOnInit(): Promise<void> {
    this.languauges = await this.CommonService.getProjectLanguagesForUser();
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
    this.ongoingData = this.CallsSrvice.search(value, this.ongoingData, this.unfilterOngoingData)
  }
}
