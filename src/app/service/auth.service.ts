import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/User';
import { gigaaasocketapi } from './gigaaasocketapi.service';
import { GigaaaApiService } from './gigaaaapi.service';
import { ltLocale } from 'ngx-bootstrap/chronos';
import { MessageService } from './messege.service';
import { sharedres_service } from './sharedres.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { agentsocketapi } from './agentsocketapi';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  integration:any;
  public user: BehaviorSubject<User>;
  token: any;
  orgId:any;
  
  constructor(private http: HttpClient,private gigaaaApiService:GigaaaApiService,
    private message:MessageService,
    private sharedres:sharedres_service,
    private agentsocket:agentsocketapi,
    private gigaaasocket:gigaaasocketapi) {
    this.user = new BehaviorSubject(this.getLoggedUser());
   }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('gigaaa-user');
  }
  getCurrentUser(token):Observable<any> {
    return this.http.get(`${environment.apiUrl}/current-user`, { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}`}})
  }


      public getLoggedUser(): User {
      const user: any = localStorage.getItem('gigaaa-user');
      let logged_user= JSON.parse(user);
      return logged_user;
       }

      canActivate() {
        return this.isLoggedIn()
      }

        // get organization id 
        public  async getOrganizationId(token:any): Promise<any>{
          try{
      
          const subsid=await this.gigaaaApiService.getsubsid(token);
          this.orgId=subsid['uuid'];
          const subsiddata = JSON.parse(localStorage.getItem('gigaaa-user'));
          subsiddata['subscription_id']={subsid};
         await this.getallintegrationlist(token,this.orgId);
          localStorage.setItem('gigaaa-user', JSON.stringify(subsiddata));
          }
          catch(err)
          {
            this.message.setErrorMessage(err.error.error);
          }
          }

      // get all integration
    private async  getallintegrationlist(token:any,orgid:any):Promise<any>
      {          
      try {
      this.gigaaaApiService.getallintegration(token,orgid).subscribe(data=>{
      this.integration=data;
      if(this.integration.length!=0)
      {
        this.integration.forEach(async element => {
        if(element.last_used===true)
        { 
        localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
        this.sharedres.showagentListonload(1);
      await  this.getLOggedinUserUuid(token,orgid,element.uuid);

      }
      });
      }
  
    });

    } catch (error) {
    this.message.setErrorMessage(error);
    }
    }
    // get loggedin Agent uuid with relation to integration id
    public async getLOggedinUserUuid(token,orgid,int_id):Promise<any>
    {
      try{
        let data=await this.gigaaaApiService.getloggedinagentuuid(token,orgid,int_id);
        localStorage.setItem('userlogged_uuid', JSON.stringify(data));
        this.ClosellSockets({int_id:int_id});
      }
      catch(err)
      {
         this.message.setErrorMessage(err.error.error); 
      }        
      
    }
    // invitation code 
      public  async getinvitationToken(token): Promise<void>
       {
      try
      {
      const code = JSON.parse(localStorage.getItem('gigaaa-invitation'))
    if(code!=undefined)
    {
      console.log(code)
      var code_invite={"invitation_code": code}
      await this.gigaaaApiService.sendinvitationcode(token,code_invite);
      localStorage.removeItem('gigaaa-invitation');
    }
    }
    catch(err){
      this.message.setErrorMessage(err.error.error);
    }
    }

    // close the socket if open alreayd and open
  private async  ClosellSockets(data):Promise<void>    {
     

      await  this.sharedres.getcallsocketapi(1);
      await   this.sharedres.getintegrationrelation(data);
        this.sharedres.getuserole();  

    }
}
