/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {
  newCallModelAnswered,
  newCallModelIncoming,
  newCallModelMissed,
  newCallModelOngoing,

} from 'src/app/models/callModel';
import { OneSelect } from 'src/app/models/oneSelect';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { QueueSocketService } from 'src/app/workdeskSockets/queueSocket/queue-socket.service';
import { callType } from '../callsData';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  constructor(private QueueSocketService: QueueSocketService,
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService
  ) { }
  sendDataToIncomingTabsSubject = new ReplaySubject<newCallModelIncoming>(0);
  sendDataToMissedTabsSubject = new ReplaySubject<newCallModelMissed>(0);
  sendDataToOngoingTabsSubject = new ReplaySubject<newCallModelOngoing>(0);
  sendDataToAnsweredTabsSubject = new ReplaySubject<newCallModelAnswered>(0);
  public callQueueSocketByLanguageandCall(
    languageId: number[],
    callType: string[],
    tabName: string,
    time_range: string,

  ) {
    this.QueueSocketService.sendQueueParameter({
      call_type: callType,
      languages: languageId,
      tab: tabName,
      time_range: time_range
    });
  }
  public callQueueSocketByLanguageandCallFoPagination(
    languageId: number[],
    callType: string[],
    tabName: string,
    time_range: string,
    items_per_page: number,
    page_number: number,
    search_value: string
  ) {
    this.QueueSocketService.sendQueueParameterPagination({
      call_type: callType,
      languages: languageId,
      tab: tabName,
      time_range: time_range,
      items_per_page: items_per_page,
      page: page_number,
      search_value: search_value,
    });
  }

  public getCallTypeId(ids: number[]) {
    let selectedCallType: any = [];
    const callTypeData = callType.data;
    ids.forEach((id: number) => {
      const selectedType = callTypeData.find(
        (data: OneSelect) => id == data.id
      );
      selectedCallType.push(selectedType?.name.toLowerCase());
    });
    return selectedCallType;
  }
  sendDataToTabs(data: any, tabname: string) {
    switch (tabname) {
      case 'incoming':
        this.sendDataToIncomingTabsSubject.next(data);
        break;
      case 'ongoing':
        this.sendDataToOngoingTabsSubject.next(data);
        break;
      default:
        break;
    }
    return [];
  }

  sendDatatoMissedAndAnswered(data: any, tabname: string) {
    switch (tabname) {
      case 'missed':
        this.sendDataToMissedTabsSubject.next(data);
        break;
      case 'finished':
        this.sendDataToAnsweredTabsSubject.next(data);
        break;
      default:
        break;
    }

  }

  // calulate time
  calculatetime(totalSeconds: number) {
    totalSeconds = Number(totalSeconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    // let hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
    let mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '00';
    let sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '00';
    return ('0' + mDisplay).slice(-2) + ':' + ('0' + sDisplay).slice(-2);
  }

  gettimedurationformissedandanswered(val: string) {
    const myDate = new Date(val);
    return (
      ('0' + myDate.getHours()).slice(-2) +
      ':' +
      ('0' + myDate.getMinutes()).slice(-2)
    );
  }
  // check user Id
  getUserId(id: string) {
    return id === null ? 'Anon' : id;
  }

  // get ellapsed time
  getElapsedTime(entry: string) {
    let myDate = new Date(entry);
    let totalSeconds = Math.floor(
      (new Date().getTime() - myDate.getTime()) / 1000
    );
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }
    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }
    seconds = totalSeconds;
    return 0 + ':' + seconds;
  }

  // search call details 
  public search(data: string, AgentList: any[], AllAgentsData: any[]) {
    const result: any[] = AllAgentsData.filter((obj: any) => {
      if (obj.user_id != null) {
        return obj.agent_name.toLowerCase().includes(data.toLowerCase()) || obj.user_id.toLowerCase().includes(data.toLowerCase());
      }
      else if (obj.user_id === null) {
        return obj.agent_name.toLowerCase().includes(data.toLowerCase());
      }
    })
    if (data.length === 0) {
      return AgentList;
    }
    else {
      return result;
    }
  }

  getCalledAtTimeDate(val: string, selectedRange: string) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let time;
    let myDate = new Date(val);
    if (selectedRange === "today" || selectedRange === "yesterday") {
      time = ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2)
      return time;
    }
    else if (selectedRange === "this_month" || selectedRange === "last_month") {
      time = myDate.getDate() + '\xa0' + monthNames[myDate.getMonth()] + '\xa0' + ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2);

      return time;
    }
    else if (selectedRange === "this_week" || selectedRange === "last_week") {
      time = myDate.getDate() + '\xa0' + monthNames[myDate.getMonth()] + '\xa0' + ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2);
      return time;
    }
    else if (selectedRange === "this_year" || selectedRange === "last_year") {
      time = myDate.getDate() + '\xa0' + monthNames[myDate.getMonth()] + '\xa0' + ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2);
      return time;
    }
    else if (selectedRange === "custom") {
      time = ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2)
      return time;
    }
    else {
      return '00:00'
    }
  }



  getCallTypeName(data: string) {
    switch (data) {
      case 'audio':
        return 'Audio Call';
      case 'video':
        return 'Video Call';
      case 'chat':
        return 'Live Chat';
      default:
        return 'Audio Call';
    }
  }
}
