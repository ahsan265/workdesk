import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { addsubscriptiondata, subsdata, User } from '../model/User';
import { GigaaaApiService } from './gigaaaapi.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { gigaaasocketapi } from './gigaaasocketapi.service';
import { MessageService } from './messege.service';
import { UserloginserviceService } from './userloginservice.service';
import { AuthService } from './auth.service';
import { agentsocketapi } from './agentsocketapi';
import { sharedres_service } from './sharedres.service';
@Injectable({
  providedIn: 'root'
})

export class oAuthService  {
  integration:any;
  constructor(private AccountAuth:AuthService,
    private gigaaaapi:GigaaaApiService,
    private router: ActivatedRoute,
    private useraccountservice:UserloginserviceService
    ,private message:MessageService,
    private sharedres:sharedres_service,
    private agentsocketapi:agentsocketapi,
    private gigaaaApiService: GigaaaApiService) {
  }

  public  async login(): Promise<void> {
 
    try { 
      // const Loggedin_user= this.AccountAuth.getLoggedUserToken();
      // const data={ token_type: Loggedin_user['token_type'],
      // expires_in: Loggedin_user['expires_in'],
      // access_token:Loggedin_user['access_token'],
      // refresh_token :Loggedin_user['refresh_token']};

  //  localStorage.setItem('gigaaa-subscription', JSON.stringify(data))
    const token = JSON.parse(localStorage.getItem('gigaaa-subscription'))
    const code = JSON.parse(localStorage.getItem('gigaaa-invitation'))
  

    if(code!=undefined)
    {
      var code_invite={"invitation_code": code}
      await this.gigaaaApiService.sendinvitationcode(token.access_token,code_invite);
    }
    const subsiddata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
    const subsid=await this.gigaaaApiService.getsubsid(subsiddata.access_token);
    localStorage.setItem('gigaaa-user', JSON.stringify(this.AccountAuth.getLoggedUser()));
    subsiddata['subscription_id']={subsid}
    localStorage.setItem('gigaaa-subscription', JSON.stringify(subsiddata))
    localStorage.removeItem('gigaaa-invitation');
    }
    catch(err){
      this.handleLoginRegisterError(err);
    }
    }
  getallintegrationlist()
  {
   try {
  const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
  var accesstoken=getdata.access_token;
  var uuid=getdata.subscription_id.subsid.uuid;
  this.gigaaaapi.getallintegration(accesstoken,uuid).subscribe(data=>{
  this.integration=data;
  this.integration.forEach(element => {
    if(element.last_used===true)
    { localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
      this.gigaaaapi.getloggedinagentuuid(accesstoken,uuid,element.uuid).subscribe(data=>{
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
  public logOff() {
    localStorage.clear();
  }


  public getLoggedUser(): User {
    return JSON.parse(localStorage.getItem('gigaaa-user'));
  }


  public updateUser(user: User) {
  //  localStorage.removeItem('gigaaa-user');
    localStorage.setItem('gigaaa-user', JSON.stringify(user));
  }

}
