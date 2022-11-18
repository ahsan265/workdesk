import { agents, callTypeAnswered } from './answeredData';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  AnsweredCallModel,
  AnsweredCallModelTable
} from 'src/app/models/callModel';
import { answeredTablaSetting } from '../missed/missedData';
import { CallsService } from '../callService/calls.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { callsIndicatorData } from 'src/app/models/callIndicatorModel';
import { languauges, searchInputData } from '../callsData';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { ranges } from 'src/app/dashboard/dashboardData';

@Component({
  selector: 'app-answered',
  templateUrl: './answered.component.html',
  styleUrls: ['./answered.component.scss']
})
export class AnsweredComponent implements OnInit {
  showCalender = true;
  tableSettings = answeredTablaSetting;
  answeredData: AnsweredCallModelTable[] = [];
  unfilterAnsweredData: AnsweredCallModelTable[] = [];
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
  callType = callTypeAnswered;
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
  constructor(
    private CallsService: CallsService,
    private CommonService: CommonService,
    private calendarService: CalendarService,
  ) {
    this.callsIndicatorData = {
      text: this.answeredData + ' answered requests',
      icon: '../assets/images/components/calls_count_answered.svg',
      backgroundColor: '#EBF6DD',
      borderColor: '1px solid #C1E297',
      textColor: '#76CB09'
    };
  }
  async ngOnInit(): Promise<void> {
    this.languauges = await this.CommonService.getProjectLanguagesForUser();
    this.CallsService.sendDataToAnsweredTabsSubject.subscribe(
      (data: AnsweredCallModel[]) => {
        this.answeredData = data.map((answeredData) => ({
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
            text: this.CallsService.getCallType(answeredData.is_video)
          },
          call_uuid: answeredData.call_uuid,
          duration: this.CallsService
            .getCalledAtTimeDate(answeredData.call_started_at, this.aggregate),
          agent_name: answeredData.name,
          user_id: this.CallsService.getUserId(answeredData.user_id),
          agent_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: 'csahsan021@gmail.com'
          }
        }));
        this.unfilterAnsweredData = this.answeredData
        this.callsIndicatorData.text = this.answeredData.length + ' answered requests';

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
      'finished',
      this.aggregate
    );
    console.log(this.aggregate);
  }

  public callOutput(callTypeOutput: any) {
    this.callTypeName = this.CallsService.getCallTypeId(callTypeOutput);
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate
    );
  }

  public languaugesOutput(languageOutput: number[]) {
    this.languageIds = languageOutput;
    this.CallsService.callQueueSocketByLanguageandCall(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate
    );
  }
  // filter answered data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    this.answeredData = this.CallsService.search(value, this.answeredData, this.unfilterAnsweredData);
    this.callsIndicatorData.text = this.answeredData.length + ' answered requests';

  }
}
