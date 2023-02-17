import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent {
  constructor(private Router:Router) {
    
  }
  close()
  {
    this.Router.navigate(['requests']);
  }
}
