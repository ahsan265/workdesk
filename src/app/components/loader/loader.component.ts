import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { getOrganizationService } from 'src/app/workdeskServices/organizationService/organization-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private router: Router,
    private getOrganizationService: getOrganizationService, private CommonService: CommonService) { }

  ngOnInit(): void {
      this.getOrganizationService.checkUserIsAuthorized(this.CommonService.getEndpointsParamLocal().token)
  }

}
