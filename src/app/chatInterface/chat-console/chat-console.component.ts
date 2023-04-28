import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { ChatWrapperComponent } from '../chat-wrapper/chat-wrapper.component';
import { ChattextAreaComponent } from '../chattext-area/chattext-area.component';

@Component({
  selector: 'app-chat-console',
  templateUrl: './chat-console.component.html',
  styleUrls: ['./chat-console.component.scss'],
})
export class ChatConsoleComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private scrollBottom!: ElementRef;
  @ViewChild('showScrollButton') showScrollButton!: ChatWrapperComponent;
  @ViewChild('textAreaComponent') textAreaComponent!: ChattextAreaComponent;
  isReadMessage: boolean = false;
  showScrollArrow: boolean = false;
  constructor(private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.isSocketOpen == 0 ? this.ChatSocketService.startChat() : '';
    this.ChatSocketService.chatMessageDataSelected.asObservable().subscribe(data => {
      data.data.find(response => {
        if (response.is_agent === true && response.is_read === false) {
          this.isReadMessage = true;
        }
      })
    })

  }
  showScrollDown(event: any) {
    (event) ? this.showScrollArrow = false : this.showScrollArrow = true
    if (event) { this.textAreaComponent.checkReadMessage(); }
  }

  ngOnInit() {
     this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (this.isReadMessage) {
     this.scrollToBottom();
      this.isReadMessage = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
      this.showScrollArrow = false;
    } catch (err) { }
  }


}
