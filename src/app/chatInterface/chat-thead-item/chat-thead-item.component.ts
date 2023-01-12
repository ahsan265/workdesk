import { Component, Input, OnInit } from '@angular/core';
import { chatThreadModel } from 'src/app/models/chatModel';
import { chatThreadData } from '../chat-threads/chatThreadData';

@Component({
  selector: 'app-chat-thead-item',
  templateUrl: './chat-thead-item.component.html',
  styleUrls: ['./chat-thead-item.component.scss']
})
export class ChatTheadItemComponent implements OnInit {
  chatData = chatThreadData;
  ngOnInit(): void {
  }
}
