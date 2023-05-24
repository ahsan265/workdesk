import { Component, OnInit } from '@angular/core';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { Organization } from 'src/app/models/organization';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { getOrganizationService } from 'src/app/workdeskServices/organizationService/organization-service.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';
import { SwitchOgranizationDoneComponent } from '../switch-ogranization-done/switch-ogranization-done.component';

@Component({
  selector: 'app-switch-organization',
  templateUrl: './switch-organization.component.html',
  styleUrls: ['./switch-organization.component.scss']
})
export class SwitchOrganizationComponent implements OnInit {
  organizations: Organization[] = [];
  constructor(private SharedServices: SharedServices,
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private MessageService: MessageService,
    private getOrganizationService: getOrganizationService, private OverlayService: OverlayService) {

    this.GigaaaApiService.getOrganization(this.CommonService.getEndpointsParamLocal().token).then((data: any) => {
      this.organizations = data
    })
  }
  ngOnInit(): void {
  }

  getCounter(value: number) {
    return new Array(value);
  }

  // close the dialog for organization switching 
  closeOrganizationSwitcher() {
    this.OverlayService.close();
  }

  // set last Used Organization 

  public async setLastUsedOrganization(organization: any) {
    try {
      if (organization.uuid !== this.CommonService.getEndpointsParamLocal().organization) {
        await this.GigaaaApiService.setLastUsedOrganization(this.CommonService.getEndpointsParamLocal().token, organization.uuid);
        await this.getOrganizationService.getOrganization(this.CommonService.getEndpointsParamLocal().token, true);
        this.OverlayService.close();
        this.showDoneSwitchOrganization();
      }
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error)
    }
  }
  showDoneSwitchOrganization() {
    this.OverlayService.open({
      component: SwitchOgranizationDoneComponent,
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      panelClass: 'swtichOrganizationDonePopup'
    })
  }


}
