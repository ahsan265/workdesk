import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatOperationService } from 'src/app/workdeskServices/chatInterfaceServices/chatOperation/chat-operation.service';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';

@Component({
  selector: 'app-chattext-area',
  templateUrl: './chattext-area.component.html',
  styleUrls: ['./chattext-area.component.scss']
})
export class ChattextAreaComponent {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });
  disableTextArea: boolean = false;
  constructor(private ChatOperationService: ChatOperationService, private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
      data.data.length !== 0 ? (this.messageForm.controls?.message.enable(),this.disableTextArea=false) : (this.messageForm.controls?.message.disable(),this.disableTextArea=true);
      
    })
  }
  endChat() {
    this.ChatOperationService.endChat();
  }
  sendMessage() {
    if (this.messageForm.controls?.message.value !== null && this.messageForm.controls?.message.value !== '') {
      this.ChatSocketService.sendMessageDataText(this.messageForm.controls?.message.value, this.ChatSocketService.lastSelectMessageUuid);
      this.messageForm.patchValue(
        {
          message: null
        },
        { emitEvent: false, onlySelf: true }
      );
    }
  }
}
