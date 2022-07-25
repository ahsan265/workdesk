import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { sidebarData } from 'src/app/data';
import { Organization, Project } from 'src/app/models/organization';
import { ConnectionSecurityService } from 'src/app/workdeskSockets/socketConnectionSecurity/connection-security.service';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { SharedServices } from '../sharedResourcesService/shared-resource-service.service';

@Injectable({
  providedIn: 'root'
})
export class getOrganizationService {
  public lastUsedOgranization: BehaviorSubject<Organization>;
  public LastUsedproject: BehaviorSubject<Project>;
  sidebarData = sidebarData;

  constructor(
    private gigaaaService: GigaaaApiService,
    private sharedRes: SharedServices,
    private ConnectionSecurityService: ConnectionSecurityService
  ) {
    this.lastUsedOgranization = new BehaviorSubject(
      this.getLastUsedOrganizationId()
    );
    this.LastUsedproject = new BehaviorSubject(this.getProjects());
  }
  // get organization for workdesk
  public getOrganization(token: string) {
    this.gigaaaService
      .getOrganization(token)
      .then((data: any) => {
        const organz: Organization[] = data;
        organz.forEach((data) => {
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
                this.sharedRes.loadCommonEps(1);
                this.getProjectList(project);
              });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // get Last used id
  public getLastUsedOrganizationId(): Organization {
    const lastUsedOrgan: any = localStorage.getItem('gigaaa-organz');
    return JSON.parse(lastUsedOrgan);
  }
  // get last projects against organization
  public getProjects(): Project {
    const listOfProjects: any = localStorage.getItem('gigaaa-project');
    return JSON.parse(listOfProjects);
  }

  // get projects list
  public getProjectList(project: Project[]) {
    let lastUsedProject: any;
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
