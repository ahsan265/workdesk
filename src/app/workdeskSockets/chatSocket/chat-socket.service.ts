import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { chatSendMessageModel, chatThreadModel, getMessageDataModel, selectedThreadModel } from 'src/app/models/chatModel';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { environment } from 'src/environments/environment';
import { chatThreadDummyData, defaultSelectChatData, defaultSendChatData } from './chatSocketData';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  ws!: WebSocket;
  protected websocket_url = `${environment.websocket_url}`;
  liveChatThread!: BehaviorSubject<chatThreadModel>;
  chatMessageDataSelected!: BehaviorSubject<getMessageDataModel>;
  chatSendMessageLast!: BehaviorSubject<chatSendMessageModel>
  lastSelectMessageUuid: string = '';

  isSocketOpen: any;
  constructor(private MessageService: MessageService) {
    this.liveChatThread = new BehaviorSubject(chatThreadDummyData);
    this.chatMessageDataSelected = new BehaviorSubject(defaultSelectChatData);
    this.chatSendMessageLast = new BehaviorSubject(defaultSendChatData)
  }
  // dial webrtcCall
  public async startChat(): Promise<any> {
    const connectionId: connectionSecurityModel = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );
    let url = this.websocket_url + '/livechat?connection=' + connectionId.connection;
    this.ws = new WebSocket(url);
    this.ws.onopen = (e: any) => {
      this.isSocketOpen = this.ws.OPEN;
    };
    // recieve data and send it to required place
    this.ws.onmessage = async (e: any) => {
      let data = JSON.parse(e.data)
      if (!Array.isArray(data)) {
        switch (data.type) {
          case 'threads':
            this.liveChatThread.next(data);
            break;
          case 'thread_messages':
            this.chatMessageDataSelected.next(data)
            break;
          default:
        }
      }
    };
    this.ws.onerror = (e: any) => {
      this.MessageService.setErrorMessage(e.type);

    };
    this.ws.onclose = async (e: any) => {
    };
  }

  // recall the socket
  private async recalSocket(): Promise<any> {

  }
  // send data to other peer / socket server
  public sendDataforCall(value: any) {

  }
  public getMessagesForThread(value: string) {
    this.lastSelectMessageUuid = value;
    const chatSendMessage: selectedThreadModel = {
      action: 'select_thread',
      data: value
    }
    const sendSelectedThreadData = JSON.stringify(chatSendMessage);
    this.ws.send(sendSelectedThreadData);
  }
  public sendMessageDataText(message: string, uuid: string) {
    const chatSendMessage: chatSendMessageModel = {
      action: 'message',
      data: {
        conversation_uuid: uuid,
        message: message,
        type: 'text'
      }
    }
    this.chatSendMessageLast.next(chatSendMessage);
    const sendMessageData = JSON.stringify(chatSendMessage);
    this.ws.send(sendMessageData);
  }
  public closeChatSocket() {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.ws?.close();
    }
  }
}
