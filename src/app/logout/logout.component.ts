import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../service/auth.service';
import { oAuthService } from '../service/authservice.service';
import { gigaaasocketapi } from '../service/gigaaasocketapi.service';
import * as color from 'string-to-color';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: []
})
export class LogoutComponent implements OnInit {
  redirectUri = environment.uri;

  constructor(
    private authService: AuthService,
    private OauthService:oAuthService,
    private cookie: CookieService,
    private agentsocket:gigaaasocketapi,
    private socketapi:gigaaasocketapi

  ) { }

  ngOnInit(): void {
    this.authService.accessToken.next(null);
    this.socketapi.closewebsocketcalls();
    this.agentsocket.closewebsocketcalls();
    this.cookie.deleteAll();
    this.OauthService.logOff();
    this.authService.logOff();
    location.href = this.redirectUri;
  }

}