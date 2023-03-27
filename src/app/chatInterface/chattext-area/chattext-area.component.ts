import { Component } from '@angular/core';
import { ChatOperationService } from 'src/app/workdeskServices/chatInterfaceServices/chatOperation/chat-operation.service';

@Component({
  selector: 'app-chattext-area',
  templateUrl: './chattext-area.component.html',
  styleUrls: ['./chattext-area.component.scss']
})
export class ChattextAreaComponent {
  constructor(private ChatOperationService: ChatOperationService) {

  }
  endChat() {
    this.ChatOperationService.endChat();
  }
}
