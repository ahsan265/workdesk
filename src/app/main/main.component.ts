/* eslint-disable no-undef */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable sort-imports */
/* eslint-disable no-unused-vars */

import { Component, Inject, OnInit } from '@angular/core';
import { icons, sidebarData, websites } from '../data';
import { AuthService } from '../services/auth.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getOrganizationService } from '../workdeskServices/organizationService/organization-service.service';
import { AgentSocketService } from '../workdeskSockets/agentSocket/agent-socket.service';
import { GigaaaApiService } from '../workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { AgentAction } from '../models/agentSocketModel';
import { AgentInviteService } from '../workdeskServices/agentInviteService/agent-invite.service';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pageTitle: string = '';
  slideOpened: boolean = false;
  oauthUrl = `${environment.oauth_url}`;
  redirectUri = `${environment.oauth_url}/logout?continue=${environment.uri}logout`;
  statusOnline: boolean = false;
  sendUserStatus = new ReplaySubject(1);
  showModal: boolean = false;
  websites = websites;
  icons = icons;
  sidebarData = sidebarData;
  constructor(
    public authService: AuthService,
    private AgentSocketService: AgentSocketService,
    private getOrganizationService: getOrganizationService,
    @Inject('GigaaaHeaderService') private headerService: GigaaaHeaderService,
    private CommonService: CommonService,
    private GigaaaApiService: GigaaaApiService,
    private AgentInviteService: AgentInviteService
  ) {}

  ngOnInit() {
    this.authService.pageTitle.subscribe((res: any) => {
      this.pageTitle = res;
    });
    this.AgentSocketService.AgentLiveStatus.subscribe((data: boolean) => {
      this.statusOnline = data;
    });
  }

  onNoLoggedUsers(event: any) {
    console.log(event);
  }

  onGetLoggedUser(event: any) {
    this.getOrganizationService.getOrganization(event.api_token);
  }

  isSlideOpened(slideOpened: boolean) {
    this.slideOpened = slideOpened;
  }

  getSelectedDropdownItem(event: any) {
    this.GigaaaApiService.updateLastUsediPorject(
      this.authService.user.value.api_token,
      this.CommonService.getEndpointsParamLocal().organization,
      { project: event.uuid }
    );
    this.getOrganizationService.getOrganization(
      this.CommonService.getEndpointsParamLocal().token
    );
  }

  setOnlineStatus(event: boolean): void {
    this.AgentSocketService.setAgentOnlineStatus(event);
  }

  addNewRouteName(event: string): string {
    return (this.pageTitle = event);
  }

  isSidebarOpen(event: any) {
    console.log(event);
  }

  onCancelButtonClicked(event: any) {
    if (event) {
      this.showModal = false;
    }
  }
}
