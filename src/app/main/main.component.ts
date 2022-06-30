/* eslint-disable no-unused-vars */
import { Component, Inject, OnInit } from '@angular/core';
import { icons, sidebarData, websites } from '../data';
import { AuthService } from '../services/auth.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pageTitle: string = 'workdesk';
  slideOpened: boolean = false;
  oauthUrl = `${environment.oauth_url}`;
  redirectUri = `${environment.oauth_url}/logout?continue=${environment.uri}logout`;
  statusonline: any;
  sendUserStatus: any;
  showModal: any;

  websites = websites;
  icons = icons;
  sidebarData = sidebarData;

  constructor(
    public authService: AuthService,
    @Inject('GigaaaHeaderService') private headerService: GigaaaHeaderService
  ) {}

  ngOnInit() {
    let user = this.authService.getLoggedUser();
  }

  onNoLoggedUsers(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  onGetLoggedUser(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  isSlideOpened(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  getSelectedDropdownItem(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  setonlinestatus(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  addNewRouteName(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  isSidebarOpen(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }

  onCancelButtonClicked(event: any) {
    // eslint-disable-next-line no-undef
    console.log(event);
  }
}
