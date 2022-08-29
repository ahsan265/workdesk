import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devicesInformation/devices-information.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CallSocketService {
  ws!: WebSocket;
  protected websocket_url = `${environment.websocket_url}`;
  sendDataToInterface = new Subject<any>();
  constructor(private DevicesInformationService: DevicesInformationService) {}
  // dial webrtcCall
  public async dialCall(
    calluuid: string,
    userid: string,
    is_refresh: boolean,
    browser_name: string,
    connectionid: string
  ): Promise<any> {
    let url =
      this.websocket_url +
      '/webrtc?call_uuid=' +
      calluuid +
      '&peer_id=' +
      userid +
      '&is_refreshed=' +
      is_refresh +
      '&browser_name=' +
      browser_name +
      '&connection=' +
      connectionid;
    this.ws = new WebSocket(url);
    this.ws.onopen = (e: any) => {};
    // recieve data and send it to required place
    this.ws.onmessage = async (e: any) => {
      if (e.data != 'ping') {
        let callsData = JSON.parse(e.data);
        this.sendDataToInterface.next(callsData);
      } else if (e.data == 'ping') {
        this.ws.send('pong');
      }
    };
    this.ws.onerror = (e: any) => {
      // this.MessageService.setErrorMessage(e.type);
    };
    this.ws.onclose = async (e: any) => {
      // await this.recalSocket()
    };
  }

  // recall the socket
  private async recalSocket(): Promise<any> {
    const callstat = JSON.parse(localStorage.getItem('call_info') || '{}');
    const callid = JSON.parse(localStorage.getItem('call_uuid') || '{}');
    const connectionId = JSON.parse(localStorage.getItem('socket_id') || '{}');
    if (callstat != null) {
      if (this.ws.OPEN == 1) {
        this.ws.close();
      }
      await this.dialCall(
        callid.call_uuid,
        callstat?.user_id,
        callstat?.is_refreshed,
        this.DevicesInformationService.getBrowserName(),
        connectionId?.connection
      );
    }
  }

  // send data to other peer / socket server
  public sendDataforCall(val: any) {
    this.ws.send(JSON.stringify(val));
  }
}
