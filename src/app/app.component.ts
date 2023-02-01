import { Component } from '@angular/core';
import { AgentInviteService } from './workdeskServices/agentInviteService/agent-invite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNonComplientAccountModal: boolean = false;
  constructor(private AgentInviteService: AgentInviteService) {
    this.AgentInviteService.agentNonComplientAccountSubject.subscribe(
      (data: boolean) => {
        this.showNonComplientAccountModal = data;
      }
    );

  }
  onCloseNonComplientAccount(event: any) {
    if (event) {
      this.showNonComplientAccountModal = false;
    }
  }
}
