import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { CommonService } from '../../commonEndpoint/common.service';
import { GigaaaApiService } from '../../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../../messageService/message.service';

@Injectable({
  providedIn: 'root'
})
export class ChatOperationService {
  incomingChatUuid: BehaviorSubject<string>;
  constructor(private GigaaaApiService: GigaaaApiService, private CommonService: CommonService,
    private ChatSocketService:ChatSocketService,
    private MessageService: MessageService) {
    this.incomingChatUuid = new BehaviorSubject('');
  }

  public async endChat() {
    try {
      const data = {
        "chat_uuid": this.ChatSocketService.lastSelectMessageUuid
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

}
