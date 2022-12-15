import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { analyticParamModel, barchartDataModel, cardCountModel, cardDataModel } from 'src/app/models/analyticsSocketModel';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsSocketService {
  protected websocket_url = `${environment.websocket_url}`;
  ws: WebSocket | undefined;
  isSocketOpen: any;
  public AnalyticsBarChartSubject = new Subject<barchartDataModel>();
  public AnalyticsCardSubject = new Subject<cardDataModel>();

  constructor(private CommonService: CommonService, private Router: Router) { }
  public callAnalyticsSocketEndpoint() {
    const connectionId: connectionSecurityModel = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );
    let url = this.websocket_url + '/analytics?connection=' + connectionId.connection;
    this.socketStates(url);
  }
  private socketStates(url: string) {
    this.ws = new WebSocket(url);
    // on socket connection open
    this.ws.onopen = (e) => {
      this.isSocketOpen = this.ws?.OPEN;
      this.sendAnalyticssParameter({
        time_range: "this_week",
        countries: [],
        languages: []
      });
    };
    this.ws.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        switch (data.type) {
          case 'aggregates':
            this.getAnalyticsBarChartData(JSON.parse(e.data));
            break;
          case 'counts':
            this.getAnalyticsCardData(JSON.parse(e.data));
            break;
          default:
        }

      }
      // e.data !== 'ping' ? this.getBarChartData(JSON.parse(e.data)) : '';
    };
    this.ws.onclose = (e) => { };
    this.ws.onerror = (e) => { };
  }

  // for sending params
  sendAnalyticssParameter(data: analyticParamModel) {

    if (this.isSocketOpen === 1) {
      const analyticsSocketParam = JSON.stringify(data);
      this.ws?.send(analyticsSocketParam);
    }
  }
  // send data to components

  getAnalyticsBarChartData(data: barchartDataModel) {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.AnalyticsBarChartSubject.next(data);
    }
  }
  getAnalyticsCardData(data: cardDataModel) {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.AnalyticsCardSubject.next(data);
    }
  }
  // close the analyticsa socket Connnection
  public closeAnalyticsSocketConnection() {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.ws?.close();
    }
  }
}
