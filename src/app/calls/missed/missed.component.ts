import { callTypeMissed, languauges, missedCallData, missedTableSetting, searchInputData } from './missedData';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CallsService } from '../callService/calls.service';
import {
  MissedCallModel,
  MissedCallModelTable
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { callType } from '../callsData';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { callsIndicatorData } from 'src/app/models/callIndicatorModel';
import { QueueSocketService } from 'src/app/workdeskSockets/queueSocket/queue-socket.service';
import { MultiSelect } from 'src/app/models/multiSelect';
import { ranges } from 'src/app/dashboard/dashboardData';
@Component({
  selector: 'app-missed',
  templateUrl: './missed.component.html',
  styleUrls: ['./missed.component.scss']
})
export class MissedComponent implements OnInit {
  showCalender = true;
  tableSettings = missedTableSetting;
  missedCallData: MissedCallModelTable[] = [];
  unfilterMissedCallData: MissedCallModelTable[] = [];
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
  callType = callTypeMissed;
  languauges = languauges;
  searchInputData = searchInputData;
  @ViewChild(GigaaaDaterangepickerDirective, { static: false })
  pickerDirective: GigaaaDaterangepickerDirective | undefined;
  alwaysShowCalendars: boolean | undefined;
  showCalendar: boolean = false;
  languageIds: number[] = [];
  callTypeName: string[] = [];
  callsIndicatorData!: callsIndicatorData;
  @ViewChild('calendarDropdown') calendar: any = HTMLElement;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.calendar?.nativeElement.contains(event?.target)) {
      this.showCalendar = false;
    }
  }

  pagination = {

  }
  constructor(
    private CallsService: CallsService,
    private CommonService: CommonService,
    private calendarService: CalendarService,
    private QueueSocketService: QueueSocketService
  ) {
    this.callsIndicatorData = {
      text: this.missedCallData.length + ' missed requests',
      icon: '../assets/images/components/calls_count_missed.svg',
      backgroundColor: '#F9EBEF',
      borderColor: '1px solid #F4CAD6',
      textColor: '#FF155A'
    };
  }
  async ngOnInit(): Promise<void> {
    this.languauges = await this.CommonService.getProjectLanguagesForUser();
    this.CallsService.sendDataToMissedTabsSubject.subscribe(
      (data: MissedCallModel[]) => {
        this.missedCallData = data.map((missedCallData) => ({
          agent_name: missedCallData.name,
          call_uuid: missedCallData.call_uuid,
          called_at: this.CallsService
            .getCalledAtTimeDate(missedCallData.missed_at, this.aggregate),
          callType: {
            image: this.CommonService.getConversationType(
              missedCallData.is_video
            ),
            text: this.CallsService.getCallType(missedCallData.is_video)
          },
          resaon: missedCallData.reason,
          user_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: missedCallData.name
          },
          user_id: this.CallsService.getUserId(missedCallData.user_id),
          utilites: [
            {
              image: this.CommonService.getLanguageFlags(
                missedCallData.language_id
              )
            },
            {
              image: this.CommonService.getBrowserFlag(missedCallData.browser)
            },
            {
              image: this.CommonService.getDeviceType(missedCallData.desktop)
            },
            {
              image: this.CommonService.getOperatingSystem(
                missedCallData.operating_system
              )
            }
          ],
          wait_time: this.CallsService
            .calculatetime(missedCallData.wait_time)
            .toString()
        }));
        this.unfilterMissedCallData = this.missedCallData;
        this.callsIndicatorData.text = this.missedCallData.length + ' missed requests';

      }
    );
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
        // this.aggregate = 'custom';
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
      'missed',
      this.aggregate
    );
  }

  public callOutput(callTypeOutput: any) {
    this.callTypeName = this.CallsService.getCallTypeId(callTypeOutput);
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'missed',
      this.aggregate
    );
  }

  public languaugesOutput(languageOutput: number[]) {
    this.languageIds = languageOutput;
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'missed',
      this.aggregate
    );
  }
  // filter missed data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    this.missedCallData = this.CallsService.search(value, this.missedCallData, this.unfilterMissedCallData);
    this.callsIndicatorData.text = this.missedCallData.length + ' missed requests';
    if (value.length === 0 && this.missedCallData.length === 0) {
      this.missedCallData = this.unfilterMissedCallData
    }
  }


}
