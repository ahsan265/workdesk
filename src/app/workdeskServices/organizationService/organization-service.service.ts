/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { BehaviorSubject } from 'rxjs';
import { sidebarData, sidebarDataAgent } from 'src/app/data';
import { AccountNotpartComponent } from 'src/app/modals/account-not-part/account-notpart.component';
import {
  Organization,
  Project,
  sidebarDropdownData
} from 'src/app/models/organization';
import { ConnectionSecurityService } from 'src/app/workdeskSockets/socketConnectionSecurity/connection-security.service';
import { AgentInviteService } from '../agentInviteService/agent-invite.service';
import { CommonService } from '../commonEndpoint/common.service';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../messageService/message.service';
import { SharedServices } from '../sharedResourcesService/shared-resource-service.service';

@Injectable({
  providedIn: 'root'
})
export class getOrganizationService {
  public LastUsedproject: BehaviorSubject<Project>;
  public LastUsedOrganization: BehaviorSubject<Organization>;

  sidebarData = sidebarData;
  sidebarDataAgent = sidebarDataAgent;
  organizationData: Organization[] = [];
  project: sidebarDropdownData[] = [];

  constructor(
    private gigaaaService: GigaaaApiService,
    private SharedServices: SharedServices,
    private AgentinviteService: AgentInviteService,
    private ConnectionSecurityService: ConnectionSecurityService,
    private MessageService: MessageService,
    private router: Router,
    private OverlayService: OverlayService,
    private CommonService: CommonService
  ) {
    this.LastUsedproject = new BehaviorSubject(this.getProjects());
    this.LastUsedOrganization = new BehaviorSubject(
      this.getLastUsedOrganization()
    );
  }
  // get organization for workdesk
  public async getOrganization(token: string, isAllowed: boolean) {
    await this.AgentinviteService.sendtAgentInvitationCode();
    this.gigaaaService
      .getOrganization(token)
      .then((data: any) => {
        if (data.length !== 0) {
          const organization: Organization[] = data;
          this.organizationData = organization;
          organization.forEach((data) => {
            if (data.last_used === true) {
              const lastUsedOgranization = data.uuid;
              localStorage.setItem('gigaaa-organz', JSON.stringify(data));
              this.LastUsedOrganization.next(data);
              this.project = data.projects.map((elemnt) => ({
                name: elemnt?.title,
                uuid: elemnt?.uuid,
                last_used: elemnt?.last_used
              }));
              //this.getProjectList(this.project);
              this.project.forEach(async (project) => {
                if (project.last_used === true) {
                  localStorage.setItem(
                    'gigaaa-project',
                    JSON.stringify(project)
                  );
                  await this.ConnectionSecurityService.createConnectionEndpoint(
                    token,
                    lastUsedOgranization,
                    project.uuid
                  );
                  isAllowed === true ? this.CommonService.restrictRoute() : '';
                }
              });
            }
          });
        } else {
          this.router.navigate(['logout']);
          this.OverlayService.open({
            component: AccountNotpartComponent,
            panelClass: 'notAccount',
            hasBackdrop: true,
            backdropClass: 'dark-backdrop'
          });
        }
      })
      .catch((err: any) => {
        this.MessageService.setErrorMessage(err.error.error);
      });
  }

  // check user belong to project and organization

  public async checkUserIsAuthorized(token: string) {
    await this.AgentinviteService.sendtAgentInvitationCode();
    this.gigaaaService
      .getOrganization(token)
      .then(async (data: any) => {
        if (data.length === 0) {
          this.router.navigate(['logout']);
          this.OverlayService.open({
            component: AccountNotpartComponent,
            panelClass: 'notAccount',
            hasBackdrop: true,
            backdropClass: 'dark-backdrop'
          });
        } else {
          this.router.navigate(['dashboard']);
        }
      })
      .catch((err: any) => {
        this.MessageService.setErrorMessage(err.error.error);
      });
  }
  // get last projects against organization
  public getProjects(): Project {
    const listOfProjects: any = localStorage.getItem('gigaaa-project');
    return JSON.parse(listOfProjects);
  }

  public getLastUsedOrganization(): Organization {
    const listOfProjects: any = localStorage.getItem('gigaaa-organz');
    return JSON.parse(listOfProjects);
  }
  // get projects list
  public async getProjectList(project: sidebarDropdownData[]): Promise<any> {
    let lastUsedProject: string = '';
    let sidebar: any;
    project.forEach((data: any) => {
      if (data.last_used === true) {
        lastUsedProject = data.name;
        if (this.CommonService.getIsAdminOrAgent() === true) {
          this.sidebarData.forEach((element: any) => {
            if (element.dropdown === true) {
              element.dropdownItems = project.map((data) => ({
                name: data.name,
                uuid: [data.uuid],
                isLink: false,
                selected: data.name === lastUsedProject ? true : false
              }));
              element.name = lastUsedProject;
            }
          });
          sidebar = this.sidebarData;
        } else {
          this.sidebarDataAgent.forEach((element: any) => {
            if (element.dropdown === true) {
              element.dropdownItems = project.map((data) => ({
                name: data.name,
                uuid: [data.uuid],
                isLink: false,
                selected: data.last_used === true ? true : false
              }));
              element.name = lastUsedProject;
            }
          });
          sidebar = this.sidebarDataAgent;
        }
      }
    });
    return sidebar;
  }
}
