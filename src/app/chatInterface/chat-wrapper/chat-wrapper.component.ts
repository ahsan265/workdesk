import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-wrapper',
  templateUrl: './chat-wrapper.component.html',
  styleUrls: ['./chat-wrapper.component.scss']
})
export class ChatWrapperComponent {


  getIteration()
  {
    return Array(4);
  }
}
