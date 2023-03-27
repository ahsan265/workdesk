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
import { OverlayService } from '@gigaaa/gigaaa-components';
import { SwitchOrganizationComponent } from '../modals/switch-organization/switch-organization.component';

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
  sidebarData: any[] = [];
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
    private Router: Router,
    private OverlayService: OverlayService
  ) { }
  organizationData = organizationData
  ngOnInit() {
    this.authService.pageTitle.subscribe((res: any) => {
      this.pageTitle = res;
    });
    this.AgentSocketService.AgentLiveStatus.subscribe((data: boolean) => {
      this.statusOnline = data;
    });
    this.SharedServices.LoadcommonEpsubject.subscribe(async data => {
      if (data === 1) {
        this.organizationData.name = ((this.getOrganizationService.getLastUsedOrganization().is_individual) ? this.getOrganizationService.getLastUsedOrganization().contact_person :
          this.getOrganizationService.getLastUsedOrganization().name) || '';
        await this.getOrganizationService.getProjectList(this.getOrganizationService.project).then(data => {
          this.sidebarData = data;
        })
        this.authService.user.next(this.authService.getLoggedUser());
      }
    })

    this.SharedServices.switchOrganizationDoneDialog.subscribe((data: boolean) => {
      setTimeout(() => {
        this.organizationData.name = ((this.getOrganizationService.getLastUsedOrganization().is_individual) ? this.getOrganizationService.getLastUsedOrganization().contact_person :
          this.getOrganizationService.getLastUsedOrganization().name) || '';
        this.showSwitchDoneOganization = data;
      }, 500);
    })
    // for reload projects
    this.SharedServices.reloadProjects.subscribe((data: boolean) => {
      if (data) {
        this.getOrganizationService.getOrganization(this.CommonService.getEndpointsParamLocal().token);
      }
    })
  }

  onNoLoggedUsers(event: any) {
    if (event) {
      this.Router.navigate(['logout']);
      localStorage.clear();
    }
  }
  userSwitched(event: boolean) {
  }
  onGetLoggedUser(event: any) {
    this.getOrganizationService.getOrganization(event.api_token);

  }

  isSlideOpened(slideOpened: boolean) {
    this.slideOpened = slideOpened;
  }

  getSelectedDropdownItem(event: any) {
    this.GigaaaApiService.updateLastUsediPorject(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      { project: event.uuid[0] }
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
      this.OverlayService.open({
        component: SwitchOrganizationComponent,
        backdropClass: 'dark-backdrop',
        panelClass: 'swtichOrganizationPopup',
        hasBackdrop: true
      })
    }
  }

}
