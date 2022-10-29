import { Component, OnInit } from '@angular/core';
import { AgentInviteService } from 'src/app/workdeskServices/agentInviteService/agent-invite.service';

@Component({
  selector: 'app-wrong-invitation-account',
  templateUrl: './wrong-invitation-account.component.html',
  styleUrls: ['./wrong-invitation-account.component.scss']
})
export class WrongInvitationAccountComponent implements OnInit {
  constructor(private AgentInviteService: AgentInviteService) {}

  ngOnInit(): void {}
  closeNonComplientAccountPopup() {
    this.AgentInviteService.agentNonComplientAccountSubject.next(false);
  }
}
