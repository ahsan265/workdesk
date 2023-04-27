import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-chat',
  templateUrl: './no-chat.component.html',
  styleUrls: ['./no-chat.component.scss']
})
export class NoChatComponent {
  constructor(private router: Router) {

  }

  goBack() {
    this.router.navigate(['requests','incoming'])
  }
}
