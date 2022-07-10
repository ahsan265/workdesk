/* eslint-disable no-undef */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable no-unused-vars */
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { icons, sidebarData, websites } from '../data';
import { AuthService } from '../services/auth.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  pageTitle: string = '';
  slideOpened: boolean = false;
  oauthUrl = `${environment.oauth_url}`;
  redirectUri = `${environment.oauth_url}/logout?continue=${environment.uri}logout`;
  statusOnline: boolean = false;
  sendUserStatus = new ReplaySubject(1);
  showModal: boolean = false;

  websites = websites;
  icons = icons;
  sidebarData = sidebarData;

  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject('GigaaaHeaderService') private headerService: GigaaaHeaderService
  ) {}

  ngOnInit() {
    this.authService.pageTitle.subscribe((res: any) => {
      this.pageTitle = res;
    });
  }

  onNoLoggedUsers(event: any) {
    console.log(event);
  }

  onGetLoggedUser(event: any) {
    // User restriction
  }

  isSlideOpened(slideOpened: boolean) {
    this.slideOpened = slideOpened;
  }

  getSelectedDropdownItem(event: any) {
    console.log(event);
    // For sidebar dropdown
  }

  setOnlineStatus(event: boolean): void {}

  addNewRouteName(event: string): string {
    return (this.pageTitle = event);
  }

  isSidebarOpen(event: any) {
    console.log(event);
  }

  onCancelButtonClicked(event: any) {
    if (event) {
      this.showModal = false;
    }
  }
}
