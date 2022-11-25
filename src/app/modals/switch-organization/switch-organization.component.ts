import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/models/organization';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { getOrganizationService } from 'src/app/workdeskServices/organizationService/organization-service.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

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
    private getOrganizationService: getOrganizationService) {

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
    this.SharedServices.switchOrganization(false);
  }

  // set last Used Organization 

  public async setLastUsedOrganization(organization: any) {
    try {
      await this.GigaaaApiService.setLastUsedOrganization(this.CommonService.getEndpointsParamLocal().token, organization.uuid);
      await this.getOrganizationService.getOrganization(this.CommonService.getEndpointsParamLocal().token);
      this.SharedServices.switchOrganization(false);
      this.SharedServices.showDoneOrganization(true);
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error)
    }
  }


}
