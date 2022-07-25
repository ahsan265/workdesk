import { Injectable } from '@angular/core';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import {
  QueueDateRangeParam,
  QueueSocketparamter
} from 'src/app/models/QueueSocketModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueueSocketService {
  protected websocket_url = `${environment.websocket_url}`;
  ws: WebSocket | undefined;
  isSocketOpen: any;

  constructor() { }
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
      this.SendDefaultParam();
    };
    this.ws.onmessage = (e) => {
      e.data != 'ping' ? this.getQueueSocketList(JSON.parse(e.data)) : '';
    };
    this.ws.onclose = (e) => { };
    this.ws.onerror = (e) => { };
  }

  private sendQueueParameterr(QueueSocketparamter: QueueSocketparamter) {
    if (this.isSocketOpen === 1) {
      const queueParameterObject = JSON.stringify(QueueSocketparamter);
      this.ws?.send(queueParameterObject);
    }
  }

  public getQueueSocketList(QueueList: any) {
  }
  public sendQueueDateParameter(QueueDateRangeParam: QueueDateRangeParam) {
    if (this.isSocketOpen === 1) {
      const queueDateParameterObject = JSON.stringify(QueueDateRangeParam);
      this.ws?.send(queueDateParameterObject);
    }
  }

  private SendDefaultParam() {
    this.sendQueueParameterr({
      call_type: ['audio', 'video'],
      languages: [6, 56, 83, 131, 161, 175, 179],
      tab: 'default'
    });
    this.sendQueueDateParameter({
      end_date: '2022-07-25T23:59:59.000Z',
      start_date: '2022-07-25T00:00:00.000Z',
      tab: 'finished_date'
    });
    this.sendQueueDateParameter({
      end_date: '2022-07-25T23:59:59.000Z',
      start_date: '2022-07-25T00:00:00.000Z',
      tab: 'finished_date'
    });
  }
}
