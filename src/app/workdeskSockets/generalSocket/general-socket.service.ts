import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import { NotificationDataModel, NotificationModels } from 'src/app/models/notification';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralSocketService {

  ws!: WebSocket;
  protected websocket_url = `${environment.websocket_url}`;
  public NotificationSocketData = new Subject<NotificationModels>();
  public NotificationReadS = new Subject<NotificationModels>();

  isSocketOpen: number = 0;
  constructor(private MessageService: MessageService) {

  }
  // dial webrtcCall
  public async startGeneralSocket(): Promise<any> {
    const connectionId: connectionSecurityModel = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );
    let url = this.websocket_url + '/general?connection=' + connectionId.connection;
    this.ws = new WebSocket(url);
    this.ws.onopen = (e: any) => {
      this.isSocketOpen = this.ws.OPEN;
    };
    // recieve data and send it to required place
    this.ws.onmessage = async (e: any) => {
      let data = JSON.parse(e.data)
      switch (data.type) {
        case 'logout':
          break;
        case 'notification_is_read':
          this.NotificationSocketData.next(data)
          break;
        default:
      }

    };
    this.ws.onerror = (e: any) => {
      this.MessageService.setErrorMessage(e.type);
    };
    this.ws.onclose = async (e: any) => {
      this.isSocketOpen = 0;
    };
  }

  // recall the socket
  private async recalSocket(): Promise<any> {

  }
  public closeSocket() {
    if (this.isSocketOpen === 1) {
      this.ws.close();
    }
  }

}
