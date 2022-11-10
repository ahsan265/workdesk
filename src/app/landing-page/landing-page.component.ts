/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { Router } from '@angular/router';
import { AgentInviteService } from '../workdeskServices/agentInviteService/agent-invite.service';
import { inviteLinkModel } from '../models/invite';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  modalData = {
    title: '',
    // image: '../assets/images/sidebar/agents.svg',
    onlyOneButton: false,
    buttonOne: {
      title: 'Cancel',
      backgroundColor: 'white',
      borderColor: '1px solid rgba(208,208,222,.6)',
      textColor: '#162741',
      active: false
    },
    buttonTwo: {
      title: 'Save',
      backgroundColor: '#1C54DB',
      borderColor: 'none',
      textColor: 'white',
      active: true
    },
    width: '500px',
    height: '400px'
  };
  showLinkExpireModal: boolean = false;
  showNonComplientAccountModal: boolean = false;
  landingPageData: any = {
    title:
      'Automate your customer service and offer an elevated customer experience with gigaaa AI Customer Support solution',
    text: 'Make every customer more satisfied by giving them the exact information they need, right when they need it.',
    image: '../../assets/images/landingPage/landing-page.svg',
    logo: '../../assets/images/sidebar/neo_long.svg'
  };
  oauthUrl = `${environment.oauth_url}`;
  constructor(
    private router: Router,
    private authService: AuthService,
    private headerService: GigaaaHeaderService,
    private AgentInviteService: AgentInviteService
  ) {}

  ngOnInit(): void {
    this.AgentInviteService.getInvitedAgentDetails();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.AgentInviteService.agentInviteSubject.subscribe(
      (data: inviteLinkModel) => {
        this.showLinkExpireModal = data.already_used;
        if (data.has_to_register) {
          window.open('https://accounts.gigaaa.link/register', '_self');
        }
      }
    );
  }

  onLogin(event: boolean) {
    if (event) {
      this.headerService.login();
    }
  }
  showInviteModal() {
    this.showLinkExpireModal = true;
  }
  onCloseModal(event: any) {
    if (event) {
      this.showLinkExpireModal = false;
    }
  }
}
