/* eslint-disable no-undef */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable sort-imports */
/* eslint-disable no-unused-vars */

import { Component, Inject, OnInit } from '@angular/core';
import { addons, icons, sidebarData, websites } from '../data';
import { AuthService } from '../services/auth.service';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getOrganizationService } from '../workdeskServices/organizationService/organization-service.service';
import { AgentSocketService } from '../workdeskSockets/agentSocket/agent-socket.service';
import { GigaaaApiService } from '../workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { AgentInviteService } from '../workdeskServices/agentInviteService/agent-invite.service';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { Router } from '@angular/router';
import { organizationData, organizationDoneModalData, organizationModalData } from './mainData';

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
  addOns = addons;
  icons = icons;
  sidebarData = sidebarData;
  showSwitchOganization: boolean = false;
  showSwitchDoneOganization: boolean = false;
  organizationModalData = organizationModalData
  organizationDoneModalData = organizationDoneModalData

  constructor(
    public authService: AuthService,
    private AgentSocketService: AgentSocketService,
    private getOrganizationService: getOrganizationService,
    private CommonService: CommonService,
    private GigaaaApiService: GigaaaApiService,
    private SharedServices: SharedServices,
    private Router: Router
  ) { }
  organizationData = organizationData
  ngOnInit() {
    this.authService.pageTitle.subscribe((res: any) => {
      this.pageTitle = res;
    });
    this.AgentSocketService.AgentLiveStatus.subscribe((data: boolean) => {
      this.statusOnline = data;
    });
    this.SharedServices.LoadcommonEpsubject.subscribe(data => {
      if (data === 1) {
        this.organizationData.name = ((this.getOrganizationService.getLastUsedOrganization().is_individual) ? this.getOrganizationService.getLastUsedOrganization().contact_person :
          this.getOrganizationService.getLastUsedOrganization().name) || '';
      }
    })
    this.SharedServices.switchOrganizationDialog.subscribe((data: boolean) => {
      this.showSwitchOganization = data;
    })
    this.SharedServices.switchOrganizationDoneDialog.subscribe((data: boolean) => {
      setTimeout(() => {
        this.showSwitchDoneOganization = data;
        this.organizationData.name = ((this.getOrganizationService.getLastUsedOrganization().is_individual) ? this.getOrganizationService.getLastUsedOrganization().contact_person :
          this.getOrganizationService.getLastUsedOrganization().name) || '';
      }, 500);
    })
  }

  onNoLoggedUsers(event: any) {
    if (event) {
      this.Router.navigate(['logout']);
      localStorage.clear();
    }
  }
  userSwitched(event: boolean) {
    console.log(event)
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
  onCloseModal(event: boolean) {
    if (event) {
      this.showSwitchOganization = !event
    }
  }

  // done switch organization modal 
  onCloseSWitchDone(event: boolean) {
    if (event) {
      this.showSwitchDoneOganization = !event
    }
  }
  // swithc organization
  openOgranizationSwitcher(value: boolean) {
    if (value) {
      this.showSwitchOganization = value;
    }
  }

}
