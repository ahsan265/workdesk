import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';

@Injectable({
  providedIn: 'root'
})
export class CanloadService implements CanLoad {
  constructor(private CommonService: CommonService, private Router: Router) {}
  canLoad(): boolean {
    return this.CommonService.getIsAdminOrAgent() ? true : false;
  }

  redirectionUserWise() {
    this.canLoad() === true
      ? this.Router.navigate(['dashboard'])
      : this.Router.navigate(['calls']);
  }
}
