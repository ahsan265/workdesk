import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  chatThreadModelData } from 'src/app/models/chatModel';
import { ChatSocketService } from 'src/app/workdeskSockets/chatSocket/chat-socket.service';
import { chatThreadData } from '../chat-threads/chatThreadData';

@Component({
  selector: 'app-chat-thead-item',
  templateUrl: './chat-thead-item.component.html',
  styleUrls: ['./chat-thead-item.component.scss']
})
export class ChatTheadItemComponent implements OnInit {

  @Input() selectedConversation!: chatThreadModelData;

  @Output() selectedConversationOutPut = new EventEmitter();
  chatData = chatThreadData;
  selectedUuid: string = '';
  constructor(private ChatSocketService: ChatSocketService) {
    this.ChatSocketService.liveChatThread.asObservable().subscribe(data => {
      this.selectedUuid = data.selected_thread;
      this.chatData = data.data.map(((thread) => ({
        counter: thread.unread_messages_count,
        date: thread.date_time,
        image: thread.images?.original,
        last_message: thread.last_message,
        name: thread.username,
        uuid: thread.uuid
      })))
    })
    this.chatData.length !== 0 ?
      this.ChatSocketService.getMessagesForThread(this.chatData[0].uuid) : '';

  }
  ngOnInit(): void {
  }
  selectThread(chatThreadModelData: chatThreadModelData) {
    this.selectedConversationOutPut.next(chatThreadModelData);
    this.ChatSocketService.getMessagesForThread(chatThreadModelData.uuid);
  }
}
