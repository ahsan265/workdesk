import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatOperationService } from 'src/app/workdeskServices/chatInterfaceServices/chatOperation/chat-operation.service';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { chatThreadModelData } from 'src/app/models/chatModel';
import { selectedThreadData } from '../chat-threads/chatThreadData';

@Component({
  selector: 'app-chattext-area',
  templateUrl: './chattext-area.component.html',
  styleUrls: ['./chattext-area.component.scss']
})
export class ChattextAreaComponent implements OnDestroy {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });
  timer: any;
  disableTextArea: boolean = false;
  chatThreadModelData: chatThreadModelData = selectedThreadData
  startTimer: number = 0;
  constructor(private ChatOperationService: ChatOperationService, private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
      data.data.length !== 0 ? (this.messageForm.controls?.message.enable(), this.disableTextArea = false) : (this.messageForm.controls?.message.disable(), this.disableTextArea = true);
    });
    // get typing status;
    this.ChatSocketService.typingMessage.asObservable().subscribe(data => {
      this.chatThreadModelData = this.ChatSocketService.lastSelectThreadUuid;
      this.chatThreadModelData.isTyping = data.isTyping || false;
    })
    // detct typing 
    this.messageForm.controls.message.valueChanges.subscribe(() => {
      if (this.startTimer > 3) {
        clearInterval(this.timer);
        this.startTimer = 0;
      }
      this.timer = setInterval(() => {
        this.startTimer++
        if (this.startTimer === 1) {
          this.typingEvent();
        }
      }, 3000);
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
  endChat() {
    this.ChatOperationService.endChat();
  }
  sendMessage() {
    if (this.messageForm.controls?.message.value !== null && this.messageForm.controls?.message.value !== '') {
      this.ChatSocketService.sendMessageDataText(this.messageForm.controls?.message.value, this.ChatSocketService.lastSelectThreadUuid);
      this.messageForm.patchValue(
        {
          message: null
        },
        { emitEvent: false, onlySelf: true }
      );
    }

  }
  checkReadMessage() {
    (this.ChatOperationService.getAllUnreadMessage().length !== 0) ?
      this.ChatOperationService.setUnreadToRead(this.ChatSocketService.lastSelectThreadUuid.uuid, this.ChatOperationService.getAllUnreadMessage()) : '';
  }

  // send agent is typing
  typingEvent() {
    this.ChatSocketService.sendIsTypingMessage(this.ChatSocketService.lastSelectThreadUuid.uuid);
  }

}
