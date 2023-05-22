/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { Router } from '@angular/router';
import { AgentInviteService } from '../workdeskServices/agentInviteService/agent-invite.service';
import { inviteLinkModel } from '../models/invite';
import { environment } from 'src/environments/environment';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  modalData = {
    width: '390px',
    height: '300px'
  };
  showLinkExpireModal: boolean = false;
  showNonComplientAccountModal: boolean = false;
  landingPageData: any = {
    logo: '../../assets/images/landingpage/workdesk_logo_lp.svg',
    title: ['Automate your <br> customer <br> service'],
    text: ['Offer an elevated customer <br> experience with gigaaa AI <br> Customer Support solution'],
    message: ['Make every customer more satisfied by giving them <br> the exact information they  need, right when they <br> need it.'],
    image: '../../assets/images/landingpage/workdesk_hero.svg',
    icons: [{ text: 'Customer Support', icon: '../assets/images/landingpage/customer_support_icon.svg' }, { text: '24/7', icon: '../assets/images/landingpage/24_7_icon.svg' },
    { text: 'Video Calls', icon: '../assets/images/landingpage/video_calls_icon.svg' }, { text: 'Audio Calls', icon: '../assets/images/landingpage/audio_call_icon.svg' }, { text: 'Multilingual', icon: '../assets/images/landingpage/multilingual_icon.svg' }, { text: 'Ticketing', icon: '../assets/images/landingpage/ticketing_icon.svg' }, { text: 'Chats', icon: '../assets/images/landingpage/chats_icon.svg' }]
  }
  oauthUrl = `${environment.oauth_url}`;
  accountUrl = `${environment.register_account}`;
  constructor(
    private router: Router,
    private authService: AuthService,
    private headerService: GigaaaHeaderService,
    private AgentInviteService: AgentInviteService,
    private SharedServices: SharedServices
  ) { }

  ngOnInit(): void {
    this.AgentInviteService.getInvitedAgentDetails();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/loading']);
    }
    this.AgentInviteService.agentInviteSubject.subscribe(
      (data: inviteLinkModel) => {
        this.showLinkExpireModal = data.already_used;
        if (data.has_to_register) {
          window.open(this.accountUrl, '_self');
        }
      }
    );
    this.AgentInviteService.agentInviteLinkExpireSubject.subscribe(data => {
      this.showLinkExpireModal = data;
    })

  }

  onLogin(event: boolean) {
    if (event) {
      this.headerService.login();
    }
  }
  register(event: boolean) {
    if (event) {
      window.open(this.accountUrl, '_self');
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
