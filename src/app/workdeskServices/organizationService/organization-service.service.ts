/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { sidebarData } from 'src/app/data';
import { Organization, Project } from 'src/app/models/organization';
import { ConnectionSecurityService } from 'src/app/workdeskSockets/socketConnectionSecurity/connection-security.service';
import { AgentInviteService } from '../agentInviteService/agent-invite.service';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../messageService/message.service';
import { SharedServices } from '../sharedResourcesService/shared-resource-service.service';

@Injectable({
  providedIn: 'root'
})
export class getOrganizationService {
  public LastUsedproject: BehaviorSubject<Project>;
  sidebarData = sidebarData;
  organizationData: Organization[] = [];

  constructor(
    private gigaaaService: GigaaaApiService,
    private SharedServices: SharedServices,
    private AgentinviteService: AgentInviteService,
    private ConnectionSecurityService: ConnectionSecurityService,
    private MessageService: MessageService,
    private router: Router
  ) {

    this.LastUsedproject = new BehaviorSubject(this.getProjects());
  }
  // get organization for workdesk
  public async getOrganization(token: string) {
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
              this.gigaaaService
                .getAllProject(token, data.uuid)
                .then((data: any) => {
                  const project: Project[] = data;
                  project.forEach(async (data) => {
                    if (data.last_used === true) {
                      localStorage.setItem(
                        'gigaaa-project',
                        JSON.stringify(data)
                      );
                      this.ConnectionSecurityService.createConnectionEndpoint(
                        token,
                        lastUsedOgranization,
                        data.uuid
                      );

                    }
                  });
                  this.getProjectList(project);
                  this.SharedServices.loadCommonEps(1);

                });
            }

          });
        } else {
          this.router.navigate(['logout']);
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
  public getProjectList(project: Project[]) {
    let lastUsedProject: string;
    project.forEach((data: any) => {
      if (data.last_used === true) {
        lastUsedProject = data.name;
        this.sidebarData.forEach((element: any) => {
          if (element.dropdown === true) {
            element.dropdownItems = project;
            element.name = lastUsedProject;
          }
        });
      }
    });
    return this.sidebarData;
  }
}
