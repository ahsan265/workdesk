/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
  }
  constructor(private CommonService: CommonService, private authService: AuthService,
  ) {
   // this.CommonService.restrictRoute();
    this.authService.pageTitle.next('Dashboard');
  }
}
