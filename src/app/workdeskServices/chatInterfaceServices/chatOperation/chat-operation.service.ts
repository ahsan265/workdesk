import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { CommonService } from '../../commonEndpoint/common.service';
import { GigaaaApiService } from '../../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../../messageService/message.service';
import { getMessageDataModel, receivedMessage } from 'src/app/models/chatModel';

@Injectable({
  providedIn: 'root'
})
export class ChatOperationService {
  incomingChatUuid: BehaviorSubject<string>;
  constructor(private GigaaaApiService: GigaaaApiService, private CommonService: CommonService,
    private ChatSocketService: ChatSocketService,
    private MessageService: MessageService) {
    this.incomingChatUuid = new BehaviorSubject('');
  }

  public async endChat() {
    try {
      const data = {
        "chat_uuid": this.ChatSocketService.lastSelectThreadUuid.getValue().uuid
      }
      await this.GigaaaApiService.setChatEnd(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, data)
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error);
    }

  }

  async awnseredChat(uuid: string) {
    try {
      const data = {
        "chat_uuid": uuid
      }
      this.incomingChatUuid.next(uuid);
      await this.GigaaaApiService.setChatAnswer(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, data)
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error);
    }

  }

  setTypingIndicationInterval(conversation_uuid: string) {
    this.ChatSocketService.sendIsTypingMessage(conversation_uuid);
  }

  // unready message 
  setUnreadToRead(conversation_uuid: string, messageIds: number[]) {
    try {
      this.GigaaaApiService.updateUnreadMessage(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, conversation_uuid, messageIds)
    }
    catch (error: any) {

    }
  }

  // get selected Thread 
  // getSelectedThread(threadUuid: string) {
  //   const data = this.ChatSocketService.liveChatThread.getValue();
  //   const selectThread = data.data.filter(response => {
  //     return response.uuid === threadUuid;
  //   })
  //   return selectThread;
  // }
  getAllUnreadMessage() {
    const data = this.ChatSocketService.chatMessageDataSelected.getValue();
    let ids: number[] = [];
    data.data.filter((response: receivedMessage) => {
      if (response.is_read === false && response.is_agent === false) {
        return ids.push(response.id)
      }
      else {
        return [];
      }
    })
    return ids;
  }
  getFirstUnreadMessage(messageData: getMessageDataModel) {
    let ids: number = 0;
    messageData.data.find((response: receivedMessage) => {
      if (response.is_read === false && response.is_agent === false) {
        return ids = response.id
      }
      else {
        return ids;
      }
    })
    return ids;
  }

}
