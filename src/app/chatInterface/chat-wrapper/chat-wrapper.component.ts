import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { getMessageDataModel } from 'src/app/models/chatModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent implements OnInit, AfterViewChecked {
  showChatMessage: boolean = false;
  selectedChatData!: getMessageDataModel
  showSelectMessage: boolean = false;
  showScrollArrow: boolean = false;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  getIteration() {

    return Array(4);
  }
  constructor(private ChatSocketService: ChatSocketService, public CommonService: CommonService) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
      (data.data.length !== 0) ? this.showChatMessage = true : this.showChatMessage = false;
    })
    this.ChatSocketService.chatMessageDataSelected.asObservable().subscribe(data => {
      this.selectedChatData = data;
      this.selectedChatData.data.length !== 0 ? this.showSelectMessage = true : this.showSelectMessage = false;
    })
  }
  ngOnInit(): void {
    this.scrollToBottom()
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom()
  }
  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  showScrollDown(event: boolean) {
    (event) ? this.showScrollArrow = true : this.showScrollArrow = false
  }
}
