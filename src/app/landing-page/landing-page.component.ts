/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { Router } from '@angular/router';
import { AgentInviteService } from '../workdeskServices/agentInviteService/agent-invite.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  showLinkExpireModal: boolean = false;
  landingPageData: any = {
    title:
      'Automate your customer service and offer an elevated customer experience with gigaaa AI Customer Support solution',
    text: 'Make every customer more satisfied by giving them the exact information they need, right when they need it.',
    image: '../../assets/images/landingPage/landing-page.svg',
    logo: '../../assets/images/sidebar/gigaaa_logo_1.svg'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private headerService: GigaaaHeaderService,
    private AgentInviteService: AgentInviteService
  ) { }

  ngOnInit(): void {
    this.AgentInviteService.getInvitedAgentDetails();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.AgentInviteService.agentInviteSubject.subscribe((data: boolean) => {
      console.log(data)
      this.showLinkExpireModal = data;
    })
  }

  onLogin(event: boolean) {
    if (event) {
      this.headerService.login();
    }
  }
  showInviteModal() {
    this.showLinkExpireModal = true;
  }
}
