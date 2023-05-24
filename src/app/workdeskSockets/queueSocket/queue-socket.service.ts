/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { BehaviorSubject, queue, Subject } from 'rxjs';
import { defaultCallData } from 'src/app/data';
import { CallsModel, newCallModelMissed } from 'src/app/models/callModel';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import {
  QueueDateRangeParam,
  QueueSocketparamter,
  QueueSocketparamterForPagination
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
  public callDataSubject = new Subject<any>();
  defaultCallData = defaultCallData;

  constructor(private CommonService: CommonService) {
  }
  public async callQueueSocketEndpoint() {
    const connectionId: connectionSecurityModel = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );
    let url =
      this.websocket_url + '/queue?connection=' + connectionId.connection;
    await this.socketStates(url);
  }

  private async socketStates(url: string): Promise<void> {
    this.ws = new WebSocket(url);
    // on socket connection open
    this.ws.onopen = (e) => {
      this.isSocketOpen = this.ws?.OPEN;
      this.SendDefaultParam();
      this.SendDefaultParamFinished();
    };
    this.ws.onmessage = (e) => {
      e.data != 'test' ? this.getQueueSocketList(JSON.parse(e.data)) : '';
    };
    this.ws.onclose = (e) => { this.isSocketOpen = 0; };
    this.ws.onerror = (e) => { };
  }

  public sendQueueParameter(QueueSocketparamter: QueueSocketparamter) {
    if (this.isSocketOpen === 1) {
      const queueParameterObject = JSON.stringify(QueueSocketparamter);
      this.ws?.send(queueParameterObject);
    }
  }

  public sendQueueParameterPagination(QueueSocketparamter: QueueSocketparamterForPagination) {
    if (this.isSocketOpen === 1) {
      const queueParameterObject = JSON.stringify(QueueSocketparamter);
      this.ws?.send(queueParameterObject);
    }
  }

  public getQueueSocketList(QueueList: any) {
    switch (QueueList.type) {
      case 'missed':
        this.defaultCallData.missed = QueueList;
        this.callDataSubject.next(QueueList);
        break;
      case 'finished':
        this.defaultCallData.finished = QueueList;
        this.callDataSubject.next(QueueList);
        break;
      case 'incoming':
        this.defaultCallData.incoming = QueueList;
        if (QueueList.new_call === true && this.CommonService.getLoggedAgentStatus() === true) {
          this.CommonService.getDesktopNotification("Customer Support", "Please connect call")
        }
        this.callDataSubject.next(QueueList);
        break;
      case 'ongoing':
        this.defaultCallData.ongoing = QueueList;
        this.callDataSubject.next(QueueList);
        break;
      default:
        break;
    }

  }
  public sendQueueDateParameter(QueueDateRangeParam: QueueDateRangeParam) {
    if (this.isSocketOpen === 1) {
      const queueDateParameterObject = JSON.stringify(QueueDateRangeParam);
      this.ws?.send(queueDateParameterObject);
    }
  }

  public SendDefaultParam() {
    this.sendQueueParameterPagination({
      call_type: [],
      languages: [],
      tab: 'missed',
      time_range: 'this_week',
      items_per_page: 10,
      page: 1,
      search_value: ''
    });
  }

  public SendDefaultParamFinished() {
    this.sendQueueParameterPagination({
      call_type: [],
      languages: [],
      tab: 'finished',
      time_range: 'this_week',
      items_per_page: 10,
      page: 1,
      search_value: ''
    });
  }
  // close the agent socket Connnection
  public closeQueueSocketConnection() {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.ws?.close();
    }
  }
}
