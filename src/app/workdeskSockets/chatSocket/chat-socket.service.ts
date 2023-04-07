import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { chatSendMessageModel, chatThreadModel, chatThreadModelData, getMessageDataModel, hasTyping, selectedThreadModel, typingChatModel, typingChatSendModel } from 'src/app/models/chatModel';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { environment } from 'src/environments/environment';
import { chatThreadDummyData, defaultSelectChatData, defaultSendChatData, defaultTypingData } from './chatSocketData';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  ws!: WebSocket;
  protected websocket_url = `${environment.websocket_url}`;
  liveChatThread!: BehaviorSubject<chatThreadModel>;
  chatMessageDataSelected!: BehaviorSubject<getMessageDataModel>;
  chatSendMessageLast!: BehaviorSubject<chatSendMessageModel>
  typingMessage!: BehaviorSubject<hasTyping>
  lastSelectThreadUuid!: chatThreadModelData;

  isSocketOpen: number = 0;
  constructor(private MessageService: MessageService) {
    this.liveChatThread = new BehaviorSubject(chatThreadDummyData);
    this.chatMessageDataSelected = new BehaviorSubject(defaultSelectChatData);
    this.chatSendMessageLast = new BehaviorSubject(defaultSendChatData);
    this.typingMessage = new BehaviorSubject(defaultTypingData);
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
          case 'typing':
            this.getIsTyping(data)
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
  public getMessagesForThread(value: chatThreadModelData) {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.lastSelectThreadUuid = value;
      const chatSendMessage: selectedThreadModel = {
        action: 'select_thread',
        data: value.uuid
      }
      const sendSelectedThreadData = JSON.stringify(chatSendMessage);
      this.ws.send(sendSelectedThreadData);

    }

  }
  public sendMessageDataText(message: string, id: chatThreadModelData) {
    if (this.ws?.OPEN === this.isSocketOpen) {
      const chatSendMessage: chatSendMessageModel = {
        action: 'message',
        data: {
          conversation_uuid: id.uuid,
          message: message,
          type: 'text'
        }
      }
      this.chatSendMessageLast.next(chatSendMessage);
      const sendMessageData = JSON.stringify(chatSendMessage);
      this.ws.send(sendMessageData);
    }
  }

  public sendIsTypingMessage(uuid: string) {
    if (this.ws?.OPEN === this.isSocketOpen) {
      const isreadMessage: typingChatSendModel = { action: "typing", data: { conversation_uuid: uuid } }
      const sendMessageData = JSON.stringify(isreadMessage);
      this.ws.send(sendMessageData);
    }
  }

  // get typing data 
  public getIsTyping(typingChatModel: typingChatModel) {
    let counter = 0;
    const typingResponse: hasTyping = {
      isTyping: true,
      data: { conversation_uuid: typingChatModel.data.conversation_uuid }
    }
    this.typingMessage.next(typingResponse);
    let typingInterval = setInterval(() => {
      counter++
   if (counter === 1) {
        const typingResponse: hasTyping = {
          isTyping: false,
          data: { conversation_uuid: typingChatModel.data.conversation_uuid }
        }
        this.typingMessage.next(typingResponse);
        clearInterval(typingInterval);
      }

    }, 5000);

  }

  public closeChatSocket() {
    if (this.ws?.OPEN === this.isSocketOpen) {
      this.ws?.close();
    }
  }
}
