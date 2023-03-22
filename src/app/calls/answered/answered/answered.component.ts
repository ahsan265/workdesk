import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  AnsweredCallModel,
  AnsweredCallModelTable,
  newCallModelAnswered
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { ranges } from 'src/app/dashboard/dashboardData';
import { answeredTablaSetting } from '../../missed/missedData';
import { answeredData, callTypeAnswered, languaugesAnswered, paginationData, searchInputData } from '../answeredData';
import { CallsService } from '../../callService/calls.service';
import { noAgentTobaleData } from 'src/app/agents/agentsData';
import { getDefaultInputsLoadOnce } from '../../defaultLoadService/incoming.Service';

@Component({
  selector: 'app-answered',
  templateUrl: './answered.component.html',
  styleUrls: ['./answered.component.scss']
})
export class AnsweredComponent implements OnInit {
  nodata = noAgentTobaleData;
  timer: any;
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
    this.CallsService.sendDataToAnsweredTabsSubject.subscribe(
      (data: newCallModelAnswered) => {
        this.pagination.totalItems = data.items_count;
        this.pagination.totolPages = data.total_pages;
        this.pagination.itemsPerPage = data.items_per_page;
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
              answeredData.request_type
            ),
            text: this.CallsService.getCallTypeName(answeredData.request_type)
          },
          call_uuid: answeredData.request_uuid,
          duration: this.CallsService
            .getCalledAtTimeDate(answeredData.request_started_at, this.aggregate),
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
      this.languageIds = [];
      this.callTypeName = [];
      this.callType.data.map(data => {
        data.selected = false;
      })
      this.searchInputData.searchText = '';
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
      this.pageNumber,
      this.lastUsedSearch
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
      this.pageNumber,
      this.lastUsedSearch
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
      this.pageNumber,
      this.lastUsedSearch
    );
  }
  // filter answered data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    const startTimer = new Date(Date.now()).getMilliseconds();
    this.timer = setTimeout(() => {
      const endTimer = new Date(Date.now()).getMilliseconds();
      if (Math.abs(startTimer - endTimer) >= 480) {
        this.pagination.currentPage = 1;
        this.pageNumber = 1;
        this.CallsService.callQueueSocketByLanguageandCallFoPagination(
          this.languageIds,
          this.callTypeName,
          'finished',
          this.aggregate,
          this.itemsPerPage,
          this.pageNumber,
          this.lastUsedSearch
        );
      }
      else {
        clearTimeout(this.timer)
      }
    }, 500)

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
      this.pageNumber,
      this.lastUsedSearch
    );
  }
  // get number of items per page()
  itemPerPage(event: number) {
    this.itemsPerPage = Number(event);
    this.pagination.itemsPerPage = this.itemsPerPage;
    this.pagination.currentPage = 1;
    this.pageNumber = 1;
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'finished',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber,
      this.lastUsedSearch
    );
  }

}
