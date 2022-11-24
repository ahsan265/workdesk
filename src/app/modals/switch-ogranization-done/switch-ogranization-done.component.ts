import { Component, HostListener, OnInit } from '@angular/core';
import { getOrganizationService } from 'src/app/workdeskServices/organizationService/organization-service.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

@Component({
  selector: 'app-switch-ogranization-done',
  templateUrl: './switch-ogranization-done.component.html',
  styleUrls: ['./switch-ogranization-done.component.scss']
})
export class SwitchOgranizationDoneComponent implements OnInit {
  name!: string;
  constructor(private SharedServices: SharedServices,
    private getOrganizationService: getOrganizationService) {
  }
  @HostListener('document:click', ['$event'])
  clickout() {
    this.SharedServices.showDoneOrganization(false);
  }
  ngOnInit(): void {
    this.name = this.getOrganizationService.getLastUsedOrganization().name || '';
  }

}
