import { ThisReceiver } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { sidebarData } from "../data";
import { Organization, Project } from "../models/organization";
import { AuthService } from "./auth.service";
import { GigaaaApiService } from "./gigaaaApiService";
import { SharedServices } from "./shared.services";



@Injectable({
  providedIn: 'root'
})

export class getOrganizationService  {
  public lastUsedOgranz: BehaviorSubject<Organization>;
  public LastUsedproject: BehaviorSubject<Project>;
  sidebarData=sidebarData;

  constructor(private gigaaaService:GigaaaApiService,private sharedRes:SharedServices) {

      this.lastUsedOgranz = new BehaviorSubject(this.getLastUsedOrganID());
      this.LastUsedproject = new BehaviorSubject(this.getProjects());

      }
      // get organization for workdesk
      public getOrganization(token:string)
      {  
          this.gigaaaService.getorganization(token).then((data: any) => {
          const organz: Organization[] = data;
          organz.forEach(data=>{
            if(data.last_used==true)
            {
              localStorage.setItem("gigaaa-organz", JSON.stringify(data));
              this.gigaaaService.getAllProject(token, data.uuid).then((data: any) => {
                const project: Project[] = data;
                project.forEach(data=>{
                  if(data.last_used==true)
                  {
                    localStorage.setItem("gigaaa-project", JSON.stringify(data));

                  }
                })
                this.sharedRes.loadCommonEps(1)
                this.getProjectList(project)
              });
            }
          })
         
        }).catch(err => {
          console.log(err);
        });
        
      }

      // get Last used id 
      public getLastUsedOrganID():Organization
      {
        const lastUsedOrgan: any = localStorage.getItem('gigaaa-organz');
            return JSON.parse(lastUsedOrgan);
      }
      // get last projects against organization 
        public getProjects():Project{
        const listOfProjects: any = localStorage.getItem('gigaaa-project');
        return JSON.parse(listOfProjects);
      }

      // get projects list 
      public getProjectList(value:Project[])
      {  
          let lastUsedProject:any;
          value.forEach((data:any)=>{
                      if(data.last_used==true)
                      {  
                      lastUsedProject=data.name;
                      this.sidebarData.forEach((element:any) => {
                      if(element.dropdown==true)
                      {  
                          element.dropdownItems=value;
                          element.name=lastUsedProject;
                      }
                      });
                      }
          })
          return this.sidebarData
      }
}
