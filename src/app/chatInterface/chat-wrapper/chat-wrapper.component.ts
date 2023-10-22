import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Destroy } from '@gigaaa/gigaaa-components/lib/directives/destroy';
import { chatThreadModel, getMessageDataModel } from 'src/app/models/chatModel';
import { ChatOperationService } from 'src/app/workdeskServices/chatInterfaceServices/chatOperation/chat-operation.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { defaultSelectChatData } from 'src/app/workdeskSockets/chatSocket/chatSocketData';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  showChatMessage: boolean = false;
  selectedChatData!: getMessageDataModel;
  showSelectMessage: boolean = false;
  showScrollArrow: boolean = false;
  chatThread!: chatThreadModel;
  getIteration() {
    return Array(4);
  }
  constructor(
    private ChatSocketService: ChatSocketService,
    public CommonService: CommonService,
    private ChatOperationService: ChatOperationService
  ) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe((data) => {
      this.chatThread = data;
      data.data.length !== 0
        ? (this.showChatMessage = true)
        : (this.showChatMessage = false);
    });
    this.ChatSocketService.chatMessageDataSelected
      .asObservable()
      .subscribe((data) => {
        this.selectedChatData = data;
        this.selectedChatData.data.length !== 0
          ? (this.showSelectMessage = true)
          : (this.showSelectMessage = false);
      });
  }
  ngOnDestroy(): void {
    this.ChatSocketService.chatMessageDataSelected.next(defaultSelectChatData);
  }
  ngOnInit(): void {}
  ngAfterViewChecked(): void {}

  showScrollDown(event: boolean) {
    event ? (this.showScrollArrow = false) : (this.showScrollArrow = true);
  }

  //set border for first Unread Meassage
  setNewMessage() {
    return this.ChatOperationService.getFirstUnreadMessage(
      this.selectedChatData
    );
  }
}
