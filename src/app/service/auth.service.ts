import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
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
import { tap, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthService implements CanActivate {
  integration:any;
  public user: ReplaySubject<User>=new ReplaySubject(1);
  token: any;
  orgId:any;
  //public LoggedUser: BehaviorSubject<User>;

  organization: any;
  lastUseIntegration: any;
  showModal: boolean ;
  constructor(private http: HttpClient,private gigaaaApiService:GigaaaApiService,
    private message:MessageService,
    private sharedres:sharedres_service,
    private router: Router) {

   //   this.LoggedUser = new BehaviorSubject(this.getLoggedUser());



    
   }

          public isLoggedIn(): boolean {
            return !!localStorage.getItem('gigaaa-user');
          }


          public getLoggedUser():User{
          const user: any = localStorage.getItem('gigaaa-user');
          let logged_user= JSON.parse(user);
          return logged_user;
          }

          // auth Guard
          canActivate(
            next: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
              if(localStorage.getItem('gigaaa-user') != undefined || null){
               return  true
              }else{
                this.router.navigate(['logout']);
                localStorage.clear();
                return false;
              }
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
      this.gigaaaApiService.getallintegration(token,orgid).then(data=>{
      this.integration=data;
      if(this.integration.length!=0)
      {
        this.integration.forEach(async element => {
        if(element.last_used===true)
        { 
        localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
   
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
      await       this.sharedres.showagentListonload(1);
      await  this.sharedres.getcallsocketapi(1);
      await   this.sharedres.getintegrationrelation(data);
        this.sharedres.getuserole();  

    }


    // user restriction 
    userRestriction(usertoken:string) {
      const user = JSON.parse(localStorage.getItem('gigaaa-user'));
    if(user!=null)
    {
      this.gigaaaApiService.getOrganizations(usertoken).pipe(
        tap((organization) => (this.organization = organization)),
        switchMap((organization) => this.gigaaaApiService.getallintegration(usertoken, organization.uuid)),
        tap((integrations: any) => {
          if (integrations.length !== 0) {
            integrations.forEach((integration) => {
              if (integration.last_used === true) {
              //  localStorage.setItem('integration_uuid', JSON.stringify({ int_id: integration.uuid, name: integration.name }));
                this.lastUseIntegration = integration;
              }
            })
          }
        }),
        switchMap(() => this.gigaaaApiService.userRestriction(this.organization.uuid, this.lastUseIntegration.uuid,usertoken)),
        tap({
          next: (event) => {
            this.sharedres.showRestrictedUser(false);
            this.showModal=false
          },
          error: (error) => {
            this.router.navigate(['logout']), this.sharedres.showRestrictedUser(true)
          this.showModal=true
        }
        }),
      ).subscribe((res: any) => {
        if (this.showModal) {
          this.router.navigate(['logout']);
      //    this.sharedres.showRestrictedUser(true)
        }
      });
      return   this.showModal;
    }
    
    }
}
