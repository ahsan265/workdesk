import { Component, ViewChild } from '@angular/core';
import { ChartWrapperComponent } from '@gigaaa/gigaaa-components';
import { Observable } from 'rxjs';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { ChatWrapperComponent } from '../chat-wrapper/chat-wrapper.component';

@Component({
  selector: 'app-chat-console',
  templateUrl: './chat-console.component.html',
  styleUrls: ['./chat-console.component.scss'],
})
export class ChatConsoleComponent {
  @ViewChild('showScrollButton') showScrollButton!: ChatWrapperComponent;
  showScrollDown(event: any) {
    this.showScrollButton.showScrollDown(event);
  }
  constructor(private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.isSocketOpen == 0 ? this.ChatSocketService.startChat() : ''
  }
}
