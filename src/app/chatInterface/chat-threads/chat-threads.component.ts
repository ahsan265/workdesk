import { Component } from '@angular/core';
import { chatThreadData } from './chatThreadData';

@Component({
  selector: 'app-chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.scss']
})
export class ChatThreadsComponent {

  public chatThreadData = chatThreadData;
}
