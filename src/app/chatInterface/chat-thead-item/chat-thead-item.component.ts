import { Component, Input, OnInit } from '@angular/core';
import { chatThreadModel, chatThreadModelData } from 'src/app/models/chatModel';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { chatThreadData } from '../chat-threads/chatThreadData';

@Component({
  selector: 'app-chat-thead-item',
  templateUrl: './chat-thead-item.component.html',
  styleUrls: ['./chat-thead-item.component.scss']
})
export class ChatTheadItemComponent implements OnInit {
  chatData = chatThreadData;
  constructor(private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
      this.chatData = data.map(((thread) => ({
        counter: thread.unread_messages_count,
        date: thread.date_time,
        image: thread.images?.original,
        last_message: thread.last_message,
        name: thread.username,
      })))
    })

  }
  ngOnInit(): void {
  }
}
