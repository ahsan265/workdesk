import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatOperationService } from 'src/app/workdeskServices/chatInterfaceServices/chatOperation/chat-operation.service';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { chatThreadModelData } from 'src/app/models/chatModel';
import { selectedThreadData } from '../chat-threads/chatThreadData';
import { defaultSelectChatData } from 'src/app/workdeskSockets/chatSocket/chatSocketData';

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
  selectedChatThreadModelData: chatThreadModelData = selectedThreadData
  startTimer: number = 0;
  showTyping: boolean = false
  constructor(private ChatOperationService: ChatOperationService, private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
      data.selected_thread !== "" && data.data.length !== 0 ? (this.messageForm.controls?.message.enable(), this.disableTextArea = false) : (this.messageForm.controls?.message.disable(), this.disableTextArea = true);
    });
    // this.ChatSocketService.lastSelectThreadUuid.asObservable().subscribe(data => {
    //   data.uuid === this.ChatSocketService.chatMessageDataSelected.getValue().selected_thread ? (this.messageForm.controls?.message.enable(), this.disableTextArea = false) : (this.messageForm.controls?.message.disable(), this.disableTextArea = true);
    // });
    // this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
    //   data.selected_thread != "" && data.data.length !== 0 ? (this.messageForm.controls?.message.enable(), this.disableTextArea = false) : (this.messageForm.controls?.message.disable(), this.disableTextArea = true);
    // });
    // get typing status;
    this.ChatSocketService.typingMessage.asObservable().subscribe(data => {
      this.selectedChatThreadModelData = this.ChatSocketService.lastSelectThreadUuid.getValue();
      (this.selectedChatThreadModelData.uuid === data.data.conversation_uuid && data.isTyping) ? this.showTyping = true : this.showTyping = false;
    })
    // detct typing 
    this.messageForm.controls.message.valueChanges.subscribe((data) => {
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
    this.ChatSocketService.chatMessageDataSelected.next(defaultSelectChatData)
  }
  sendMessage() {
    if (this.messageForm.controls?.message.value !== null && this.messageForm.controls?.message.value !== '') {
      this.ChatSocketService.sendMessageDataText(this.messageForm.controls?.message.value, this.ChatSocketService.lastSelectThreadUuid.getValue());
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
      this.ChatOperationService.setUnreadToRead(this.ChatSocketService.lastSelectThreadUuid.getValue().uuid, this.ChatOperationService.getAllUnreadMessage()) : '';
  }

  // send agent is typing
  typingEvent() {
    if (this.ChatSocketService.lastSelectThreadUuid.getValue().uuid !== "") {
      this.ChatSocketService.sendIsTypingMessage(this.ChatSocketService.lastSelectThreadUuid.getValue().uuid);
    }
  }

}
