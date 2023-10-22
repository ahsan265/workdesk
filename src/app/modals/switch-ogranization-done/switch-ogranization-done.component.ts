import { Component, HostListener, OnInit } from '@angular/core';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { getOrganizationService } from 'src/app/workdeskServices/organizationService/organization-service.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

@Component({
  selector: 'app-switch-ogranization-done',
  templateUrl: './switch-ogranization-done.component.html',
  styleUrls: ['./switch-ogranization-done.component.scss']
})
export class SwitchOgranizationDoneComponent implements OnInit {
  name: string = '';
  constructor(
    private SharedServices: SharedServices,
    private getOrganizationService: getOrganizationService,
    private OverlayService: OverlayService
  ) {}
  @HostListener('document:click', ['$event'])
  clickout() {
    this.OverlayService.close();
  }
  ngOnInit(): void {
    this.getOrganizationService.LastUsedOrganization.asObservable().subscribe(
      (data) => {
        this.name = data.is_individual
          ? data.contact_person || ''
          : data.name || '';
      }
    );
  }
}
