import { Component, OnInit } from '@angular/core';
import { AgentInviteService } from 'src/app/workdeskServices/agentInviteService/agent-invite.service';

@Component({
  selector: 'app-link-expire-modal',
  templateUrl: './link-expire-modal.component.html',
  styleUrls: ['./link-expire-modal.component.scss']
})
export class linkExpireModalComponent implements OnInit {
  constructor(private AgentInviteService: AgentInviteService) {}

  ngOnInit(): void {}
  closeNonComplientAccountPopup() {
    this.AgentInviteService.agentInviteLinkExpireSubject.next(false);
  }
}
