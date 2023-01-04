import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  AnsweredCallModel,
  AnsweredCallModelTable,
  newCallModelAnswered
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { callsIndicatorData } from 'src/app/models/callIndicatorModel';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { ranges } from 'src/app/dashboard/dashboardData';
import { languaugesAnswered, searchInputData } from '../../callsData';
import { answeredTablaSetting } from '../../missed/missedData';
import { answeredData, callTypeAnswered, paginationData } from '../answeredData';
import { CallsService } from '../../callService/calls.service';
import { getDefaultInputsLoadOnce } from '../../incoming/incoming.Service';

@Component({
  selector: 'app-answered',
  templateUrl: './answered.component.html',
  styleUrls: ['./answered.component.scss']
})
export class AnsweredComponent implements OnInit {
  pagination = paginationData;
  showCalender = true;
  tableSettings = answeredTablaSetting;
  answeredData: AnsweredCallModelTable[] = [];
  unfilterAnsweredData: AnsweredCallModelTable[] = [];
  lastUsedSearch: string = '';
  itemsPerPage: number = 10;
  pageNumber: number = 1;
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
  languauges = languaugesAnswered;
  searchInputData = searchInputData;
  @ViewChild(GigaaaDaterangepickerDirective, { static: false })
  pickerDirective: GigaaaDaterangepickerDirective | undefined;
  alwaysShowCalendars: boolean | undefined;
  showCalendar: boolean = false;
  languageIds: number[] = [];
  callTypeName: string[] = [];
  callsIndicatorData = answeredData;
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
    private getDefaultInputsLoadOnce: getDefaultInputsLoadOnce

  ) {
    // this.callsIndicatorData = {
    //   hightlightText: '',
    //   text: this.answeredData + ' answered requests',
    //   icon: '../assets/images/components/calls_count_answered.svg',
    //   backgroundColor: '#EBF6DD',
    //   borderColor: '1px solid #C1E297',
    //   textColor: '#76CB09',
    //   isAgent: false
    // };
    this.CallsService.sendDataToAnsweredTabsSubject.subscribe(
      (data: newCallModelAnswered) => {
        this.pagination.totalItems = data.items_count;
        this.pagination.totolPages = data.total_pages;
        this.answeredData = data.calls.map((answeredData: AnsweredCallModel) => ({
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
          agent_name: answeredData.agent.display_name,
          user_id: this.CallsService.getUserId(answeredData.user_id),
          agent_details: {
            image: answeredData.agent.images[96],
            text: answeredData.agent.email
          }
        }));
        this.unfilterAnsweredData = this.answeredData
        this.callsIndicatorData.text = this.pagination.totalItems + ' answered requests';

      }
    );
  }
  async ngOnInit(): Promise<void> {
    this.getDefaultInputsLoadOnce.answeredlanguage.asObservable().subscribe(data => {
      this.languauges = data;
    })

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
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber
    );
  }

  public callOutput(callTypeOutput: any) {
    this.callTypeName = this.CallsService.getCallTypeId(callTypeOutput);
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber
    );
  }

  public languaugesOutput(languageOutput: number[]) {
    this.languageIds = languageOutput;
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber
    );
  }
  // filter answered data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    this.answeredData = this.CallsService.search(value, this.answeredData, this.unfilterAnsweredData);
    this.callsIndicatorData.text = this.answeredData.length + ' answered requests';
    if (value.length === 0 && this.answeredData.length === 0) {
      this.answeredData = this.unfilterAnsweredData
    }
  }
  // get page number
  pagenumber(event: number) {
    this.pageNumber = event;
    this.pagination.currentPage = event;
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber
    );
  }
  // get number of items per page()
  itemPerPage(event: number) {
    this.itemsPerPage = Number(event);
    this.pagination.itemsPerPage = this.itemsPerPage;
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber
    );
  }

}
