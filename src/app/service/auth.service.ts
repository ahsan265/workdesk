import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/User';
import { oAuthService } from './authservice.service';
import { gigaaasocketapi } from './gigaaasocketapi.service';
import { GigaaaApiService } from './gigaaaapi.service';
import { ltLocale } from 'ngx-bootstrap/chronos';
import { MessageService } from './messege.service';
import { sharedres_service } from './sharedres.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  integration:any;
  public user: BehaviorSubject<User>;
  token: any;
  orgId:any;
  constructor(private gigaaaApiService:GigaaaApiService,
    private message:MessageService,
    private sharedres:sharedres_service) {
    this.user = new BehaviorSubject(this.getLoggedUser());
    this.user.subscribe(data=>{
      console.log(data)
      if(data!=null)
      { 
         this.getOrganizationId(data.api_token);
         this.getinvitationToken(data.api_token);
      }
    })
   }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('gigaaa-user');
  }

  public getLoggedUser(): User {
    const user: any = localStorage.getItem('gigaaa-user');
    return JSON.parse(user);
  }

  canActivate() {
    return this.isLoggedIn()
  }

// get organization id 
 public  async getOrganizationId(token:any): Promise<any>{
   try{
    const subsiddata = JSON.parse(localStorage.getItem('gigaaa-user'));
      const subsid=await this.gigaaaApiService.getsubsid(token);
      this.orgId=subsid['uuid'];
      subsiddata['subscription_id']={subsid};
      this.getallintegrationlist(token,this.orgId);
      localStorage.setItem('gigaaa-user', JSON.stringify(subsiddata));

   }
   catch(err)
   {
    this.message.setErrorMessage(err.error.error);

   }
    
}

// get all integration
getallintegrationlist(token:any,orgid:any)
{
try {

     this.gigaaaApiService.getallintegration(token,orgid).subscribe(data=>{

      this.integration=data;
      if(this.integration.length!=0)
      {
      this.integration.forEach(element => {
        if(element.last_used===true)
        { 
     localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
     this.sharedres.showagentListonload(1);
     this.gigaaaApiService.getloggedinagentuuid(token,orgid,element?.uuid).subscribe(data=>{
      localStorage.setItem('userlogged_uuid', JSON.stringify(data));
      this.sharedres.getcallsocketapi(1);
      this.sharedres.getintegrationrelation(1);
      });
      }
      });
      }
  
    });

    } catch (error) {
    this.message.setErrorMessage(error);
    }
    }
    public  async getinvitationToken(token): Promise<void>
    {
      try
      {

      const code = JSON.parse(localStorage.getItem('gigaaa-invitation'))

    if(code!=undefined)
    {
      var code_invite={"invitation_code": code}
      await this.gigaaaApiService.sendinvitationcode(token,code_invite);
      localStorage.removeItem('gigaaa-invitation');
    }
    }
    catch(err){
      this.message.setErrorMessage(err.error.error);
    }
    }
}
