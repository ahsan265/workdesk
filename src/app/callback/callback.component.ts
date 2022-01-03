import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { oAuthService } from '../service/authservice.service';
import { GigaaaApiService } from '../service/gigaaaapi.service';
import { MessageService } from '../service/messege.service';
import { sharedres_service } from '../service/sharedres.service';
import * as color from 'string-to-color';
import { gigaaasocketapi } from '../service/gigaaasocketapi.service';
import { agentsocketapi } from '../service/agentsocketapi';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  integration:any;
  redirectUri = environment.redirect_uri;
  clientId = environment.client_id;
  oauthUrl = environment.oauth_url;
  constructor(
      private activated: ActivatedRoute,
      private http: HttpClient,
      private cookie: CookieService,
      private router: Router,
      private apiService: GigaaaApiService,
      private authService: AuthService,
      private oauthService:oAuthService,
      private sharedres:sharedres_service,
      private message:MessageService,
      private socketapi:gigaaasocketapi,
      private agentsocketapi:agentsocketapi
    )   { }

  ngOnInit(): void {
  
    let ch = localStorage.getItem('ch');
    if (ch != null){
      let challenge = JSON.parse(ch)
      this.activated.queryParams.pipe(
        switchMap(({code}) => {
          const formData = new FormData();
          formData.append("code", code);
          formData.append("grant_type", "authorization_code");
          formData.append("redirect_uri", this.redirectUri);
          formData.append("state", challenge.state);
          formData.append("client_id", this.clientId.toString());
          formData.append("code_verifier", challenge.verify);

          return this.http.post(`${this.oauthUrl}/token`, formData)})
      ).subscribe(
        (res: any) => {
            this.authService.token = res;
            this.apiService.getCurrentUser(res.access_token).subscribe((r: any) => {
            this.authService.user.next(r);
            r.color = color.default(r.profile.first_name + r.profile.last_name);
            this.cookie.set('gigaaa_user', JSON.stringify(r));
            this.cookie.set('access_token_active', JSON.stringify(res));
            this.oauthService.login().finally(()=>{
     
              this.getallintegrationlist()
              this.router.navigate(["dashboard"]);
            })
          });
          
        },
        err => this.message.setErrorMessage(err)
      )
    }
  }

  getallintegrationlist()
  {
   try {
  const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
  var accesstoken=getdata.access_token;
  var uuid=getdata.subscription_id.subsid.uuid;
  this.apiService.getallintegration(accesstoken,uuid).subscribe(data=>{
  this.integration=data;
  this.integration.forEach(element => {
    if(element.last_used===true)
    { this.sharedres.getintegrationrelation(element.uuid);
      localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
    this.apiService.getloggedinagentuuid(accesstoken,uuid,element.uuid).subscribe(data=>{
      localStorage.setItem('userlogged_uuid', JSON.stringify(data));
      this.sharedres.getcallsocketapi(1);
      });
    }
  });
 
  })

} catch (error) {
  this.handleLoginRegisterError(error.error.error);
}
}
  private handleLoginRegisterError(response: any) {
    for (const key in response.error.errors) {
      if (response.error.errors.hasOwnProperty(key)) {
        this.message.setErrorMessage(response.error.errors[key][0], 'toast-bottom-right');
      }
    }
  }
}
