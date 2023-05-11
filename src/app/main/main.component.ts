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
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { Router } from '@angular/router';
import { notifiactionData, organizationData, organizationDoneModalData, organizationModalData } from './mainData';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { SwitchOrganizationComponent } from '../modals/switch-organization/switch-organization.component';
import { ChatSocketService } from '../workdeskSockets/chatSocket/chat-socket.service';
import { NotificationComponentModel } from '../models/notification';
import { GeneralSocketService } from '../workdeskSockets/generalSocket/general-socket.service';

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
  notificationData: NotificationComponentModel[] = [];
  showPreference: boolean = false;
  isUnreadNotification: boolean = false;

  constructor(
    public authService: AuthService,
    private AgentSocketService: AgentSocketService,
    private getOrganizationService: getOrganizationService,
    private CommonService: CommonService,
    private GigaaaApiService: GigaaaApiService,
    private SharedServices: SharedServices,
    private Router: Router,
    private OverlayService: OverlayService,
    private ChatSocketService: ChatSocketService,
    private GeneralSocketService: GeneralSocketService

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
        await this.CommonService.getAllNotification().then(data => {
          this.notificationData = data;
          this.isUnreadNotification = this.CommonService.checkIsUnread(data);
        })
        this.authService.user.next(this.authService.getLoggedUser());
        const response = this.CommonService.getIsAdminOrAgent();
        const isOwner = this.CommonService.getLoggedInAgentData().is_organization_owner;
        (response === true && isOwner === true) ? this.showPreference = true : this.showPreference = false;

      }
    })
    this.GeneralSocketService.NotificationSocketData.subscribe(data => {
      const newNotification = {
        header: data.data.title,
        date: this.CommonService.timeNow(data.data.created_at),
        message: data.data.content,
        isOpen: false,
        icon: this.CommonService.getNotificationIcon(data.type),
        id: data.data.id
      }
      this.notificationData.push(newNotification);
      this.isUnreadNotification = this.CommonService.checkIsUnread(this.notificationData);

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
    // chat unread indication
    this.ChatSocketService.unreadThread.asObservable().subscribe(isUnread => {
      if (this.sidebarData.length !== 0) {
        this.sidebarData.find(data => {
          if (data.name.includes('Chats')) {
            isUnread === true ? data.iconUrl = '../assets/images/sidebar/chat_icon_unread.svg' : data.iconUrl = '../assets/images/sidebar/chat.svg'
          }
        })
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
  async clearNotificationByOne(event: NotificationComponentModel) {
    await this.CommonService.deleteNotificationOne([event.id])
    const selectedObject = this.notificationData.findIndex(data => {
      data.id === event.id;
    })
    this.notificationData.splice(selectedObject, 1);
  }
  async clearAllNotificationByAll(event: boolean) {
    if (event && this.notificationData.length !== 0) {
      let id: number[] = []
      this.notificationData.forEach(data => {
        id.push(data.id);
      })
      await this.CommonService.deleteNotificationOne(id)
      this.notificationData.length = 0;
    }
  }
  // to read Notification
  selectedNotification(event: NotificationComponentModel) {
    this.CommonService.setUnreadTOread(event.id);
  }
}
