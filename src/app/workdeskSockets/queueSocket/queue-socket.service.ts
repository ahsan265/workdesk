/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { defaultCallData } from 'src/app/data';
import { CallsModel } from 'src/app/models/callModel';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import {
  QueueDateRangeParam,
  QueueSocketparamter
} from 'src/app/models/queueSocketModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueueSocketService {
  protected websocket_url = `${environment.websocket_url}`;
  ws: WebSocket | undefined;
  isSocketOpen: any;
  public callDataSubject = new Subject<CallsModel>();
  defaultCallData = defaultCallData;

  constructor(private CommonService: CommonService) {
  }
  public callQueueSocketEndpoint() {
    const connectionId: connectionSecurityModel = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );
    let url =
      this.websocket_url + '/queue?connection=' + connectionId.connection;
    this.socketStates(url);
  }

  private socketStates(url: string) {
    this.ws = new WebSocket(url);
    // on socket connection open
    this.ws.onopen = (e) => {
      this.isSocketOpen = this.ws?.OPEN;
      //  this.SendDefaultParam();
    };
    this.ws.onmessage = (e) => {
      e.data != 'ping' ? this.getQueueSocketList(JSON.parse(e.data)) : '';
    };
    this.ws.onclose = (e) => { };
    this.ws.onerror = (e) => { };
  }

  public sendQueueParameter(QueueSocketparamter: QueueSocketparamter) {
    if (this.isSocketOpen === 1) {
      const queueParameterObject = JSON.stringify(QueueSocketparamter);
      this.ws?.send(queueParameterObject);
    }
  }

  public getQueueSocketList(QueueList: CallsModel) {
    this.defaultCallData = {
      finished: QueueList.finished,
      incoming: QueueList.incoming,
      missed: QueueList.missed,
      ongoing: QueueList.ongoing,
      new_call: QueueList.new_call
    }
    this.callDataSubject.next(QueueList);
    if (QueueList.new_call === true && this.CommonService.getLoggedAgentStatus() === true) {
      this.CommonService.getDesktopNotification("Customer Support", "Please connect call")
    }
  }
  public sendQueueDateParameter(QueueDateRangeParam: QueueDateRangeParam) {
    if (this.isSocketOpen === 1) {
      const queueDateParameterObject = JSON.stringify(QueueDateRangeParam);
      this.ws?.send(queueDateParameterObject);
    }
  }

  public SendDefaultParam() {
    this.sendQueueParameter({
      call_type: [],
      languages: [],
      tab: 'missed',
      time_range: 'this_week'
    });

  }
  // close the agent socket Connnection
  public closeQueueSocketConnection() {
    if (this.ws?.OPEN == this.isSocketOpen) {
      this.ws?.close();
    }
  }
}
