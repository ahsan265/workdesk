import { callTypeMissed, languauges, missedCallData, missedData, missedTableSetting, paginationData, searchInputData } from '../../missed/missedData';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  MissedCallModel,
  MissedCallModelTable,
  newCallModelMissed
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaDaterangepickerDirective } from '@gigaaa/gigaaa-components';
import dayjs from 'dayjs';
import { CalendarService } from 'src/app/calendarService/calendar.service';
import { callsIndicatorData } from 'src/app/models/callIndicatorModel';
import { QueueSocketService } from 'src/app/workdeskSockets/queueSocket/queue-socket.service';
import { MultiSelect } from 'src/app/models/multiSelect';
import { ranges } from 'src/app/dashboard/dashboardData';
import { CallsService } from '../../callService/calls.service';
import { noTobaleData } from 'src/app/components/no-table-data/notableData';
import { noAgentTobaleData } from 'src/app/agents/agentsData';
import { getDefaultInputsLoadOnce } from '../../defaultLoadService/incoming.Service';
@Component({
  selector: 'app-missed',
  templateUrl: './missed.component.html',
  styleUrls: ['./missed.component.scss']
})
export class MissedComponent implements OnInit {
  nodata = noAgentTobaleData;
  timer: any;
  pagination = paginationData;
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
  itemsPerPage: number = 10;
  pageNumber: number = 1;
  @ViewChild(GigaaaDaterangepickerDirective, { static: false })
  pickerDirective: GigaaaDaterangepickerDirective | undefined;
  alwaysShowCalendars: boolean | undefined;
  showCalendar: boolean = false;
  languageIds: number[] = [];
  callTypeName: string[] = [];
  callsIndicatorData = missedData;
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
    this.CallsService.sendDataToMissedTabsSubject.subscribe((data: newCallModelMissed) => {
      this.pagination.totalItems = data.items_count;
      this.pagination.totolPages = data.total_pages;
      this.pagination.itemsPerPage = data.items_per_page
      this.missedCallData = data.calls.map((missedCallData: MissedCallModel) => ({
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
      this.callsIndicatorData.text = this.pagination.totalItems + ' missed requests';


    }
    );

  }
  async ngOnInit(): Promise<void> {
    this.getDefaultInputsLoadOnce.missedLanguage.asObservable().subscribe(data => {
      this.languauges = data;
      this.languageIds=[];
      this.callTypeName=[];
      this.callType.data.map(data=>{
        data.selected=false;
      })
      this.searchInputData.searchText='';
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
      'missed',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber,
      ''
    );
  }

  public callOutput(callTypeOutput: any) {
    this.callTypeName = this.CallsService.getCallTypeId(callTypeOutput);
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'missed',
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
      'missed',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber,
      this.lastUsedSearch
    );
  }
  // filter missed data
  getSearchValue(value: string) {
    this.lastUsedSearch = value;
    const startTimer = new Date(Date.now()).getMilliseconds();
    this.timer = setTimeout(() => {
      const endTimer = new Date(Date.now()).getMilliseconds();
      if (Math.abs(startTimer - endTimer) > 480) {
        this.pagination.currentPage = 1;
        this.pageNumber = 1;
        this.CallsService.callQueueSocketByLanguageandCallFoPagination(
          this.languageIds,
          this.callTypeName,
          'missed',
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

    // this.missedCallData = this.CallsService.search(value, this.missedCallData, this.unfilterMissedCallData);
    // this.callsIndicatorData.text = this.missedCallData.length + ' missed requests';
    // if (value.length === 0 && this.missedCallData.length === 0) {
    //   this.missedCallData = this.unfilterMissedCallData
    // }
  }
  // get page number
  pagenumber(event: number) {
    this.pageNumber = event;
    this.pagination.currentPage = event;
    this.CallsService.callQueueSocketByLanguageandCallFoPagination(
      this.languageIds,
      this.callTypeName,
      'missed',
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
      'missed',
      this.aggregate,
      this.itemsPerPage,
      this.pageNumber,
      this.lastUsedSearch
    );
  }

}
