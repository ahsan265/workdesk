/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import {
  AnsweredCallModel,
  IncomingCallModel,
  MissedCallModel,
  OngoingCallModel
} from 'src/app/models/callModel';
import { OneSelect } from 'src/app/models/oneSelect';
import { QueueSocketService } from 'src/app/workdeskSockets/queueSocket/queue-socket.service';
import { callType } from '../callsData';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  constructor(private QueueSocketService: QueueSocketService) { }
  sendDataToIncomingTabsSubject = new ReplaySubject<IncomingCallModel[]>();
  sendDataToMissedTabsSubject = new ReplaySubject<MissedCallModel[]>();
  sendDataToOngoingTabsSubject = new ReplaySubject<OngoingCallModel[]>();
  sendDataToAnsweredTabsSubject = new ReplaySubject<AnsweredCallModel[]>();

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
      case 'missed':
        this.sendDataToMissedTabsSubject.next(data);
        break;
      case 'answered':
        this.sendDataToAnsweredTabsSubject.next(data);
        break;
      default:
        break;
    }
    return [];
  }

  // get call type

  getCallType(isVideo: boolean) {
    return isVideo === true ? 'Video' : 'Audio';
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
    var myDate = new Date(entry);
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
    const result: any[] = AgentList.filter((obj: any) => {
      if (obj.user_id != null) {
        return obj.agent_name.toLowerCase().includes(data.toLowerCase()) || obj.user_id.toLowerCase().includes(data.toLowerCase());
      }
      else if (obj.user_id == null) {
        return obj.agent_name.toLowerCase().includes(data.toLowerCase());
      }
      else {
        return [];
      }
    })
    if (data.length === 0) {
      return AllAgentsData;
    }
    else {
      return result;
    }
  }

  getCalledAtTimeDate(val: string, selectedRange: string) {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    let myDate = new Date(val);
    if (selectedRange === "today" || selectedRange === "yesterday") {
      let time = ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2)
      return time;
    }
    else if (selectedRange === "this_month" || selectedRange === "last_month") {
      let time = myDate.getDate() + '\xa0' + monthNames[myDate.getMonth()] + '\xa0' + ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2);
      return time;
    }
    else if (selectedRange === "this_week" || selectedRange === "last_week") {
      let time = myDate.getDate() + '\xa0' + monthNames[myDate.getMonth()] + '\xa0' + ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2);
      return time;
    }
    else if (selectedRange === "this_year" || selectedRange === "last_year") {
      let time = myDate.getDate() + '\xa0' + monthNames[myDate.getMonth()] + '\xa0' + ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2);
      return time;
    }
    else if (selectedRange == "custom") {
      let time = ("0" + myDate.getHours()).slice(-2) + ":" + ("0" + myDate.getMinutes()).slice(-2)
      return time;
    }
    else {
      return '00:00'
    }
  }
}
