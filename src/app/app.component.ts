import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './model/User';
import { AuthService } from './service/auth.service';
import { GigaaaApiService } from './service/gigaaaapi.service';
import { LoginBtnComponent } from './useraccount/landingpage/login-btn/login-btn.component';
import * as color from "string-to-color";
import { sharedres_service } from './service/sharedres.service';
import { MessageService } from './service/messege.service';
import { agentsocketapi } from './service/agentsocketapi';
import { textChangeRangeIsUnchanged } from 'typescript';
import { oAuthService } from './service/authservice.service';
import { gigaaasocketapi } from './service/gigaaasocketapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  integration:any;
  lastuserintegration:any="";
  integration_id:any;
  pageTitle: string = 'Dashboard';
  workplaces = [];
  redirectUri = `${environment.oauth_url}/logout?continue=${environment.uri}/logout`;

  dashboardIcon = '../assets/assets_workdesk/dashboard_icon .svg';
  activedashboardIcon = '../assets/assets_workdesk/dashboard_icon .svg';

  callIcon = '../assets/assets_workdesk/calls_icon.svg';
  activeCallIcon = '../assets/assets_workdesk/calls_icon.svg';

  agentIcon = '../assets/assets_workdesk/Group_4.svg';
  activeAgentIcon = '../assets/assets_workdesk/Group_4.svg';
  
  activityIcon = '../assets/images/sidemenu//activities_icon.svg';
  activeActivityIcon = '../assets/images/sidemenu//activities_icon_active.svg';
  select_integration_icon='../assets/assets_workdesk/select_integration.svg'

  logo = '../assets/logo.png';
  logoCollapsed = '../../assets/images/sidemenu/logoShort.png';

websites=[{text:"Partnership",url:['https://partnerships.gigaaa.com/'],image:'../assets/assets_workdesk/partnership.svg'},
{text:"Console",url:['https://console.gigaaa.com/'],image:'../assets/assets_workdesk/console.svg'},
{text:"Workdesk",url:['https://workdesk.gigaaa.com/'],image:'../assets/assets_workdesk/workdesk.svg'},
{text:"Messenger",url:['https://messenger.gigaaa.com/'],image:'../assets/assets_workdesk/messenger.svg'},
{text:"Analytics",url:['https://analytics.gigaaa.com/'],image:'../assets/assets_workdesk/analytics.svg'}]
  sidebarData: any = [
    { iconUrl: this.select_integration_icon, name:"Select integration", dropdownItems:[], dropdown: true },
    {
      iconUrl: this.dashboardIcon,
      activeIconUrl: this.activedashboardIcon,
      name: 'Dashboard',
      routeUrl: ['/dashboard'],
      dropdown: false,
    },
    {
      iconUrl: this.callIcon,
      activeIconUrl: this.activeCallIcon,
      name: 'Calls',
      routeUrl: ['/calls'],
      dropdown: false,
    },
    {
      iconUrl: this.agentIcon,
      activeIconUrl: this.activeAgentIcon,
      name: 'Agents',
      routeUrl: ['/agents'],
      dropdown: false,
    },
  ];
  slideOpened: boolean = false;
  oauthUrl = `${environment.oauth_url}`;
  token: string;
  online_status:any;
  statusonline:boolean;
  accessToken;
  user: User;
  url:String;
  hideTopbar:boolean;
  constructor(
    public authService: AuthService,
    private oAuthService:oAuthService,
    private apiService: GigaaaApiService,
    private cookie: CookieService,
    private share_res:sharedres_service,
    private messegeService:MessageService,
    private agentsocketapi:agentsocketapi,
    private socketapi:gigaaasocketapi,
    private sharedres:sharedres_service,
    private router: Router,
    private route:ActivatedRoute
  ) {
  
  }
  sendUserStatus = new ReplaySubject(1);
  ngOnInit(): void {
    this.statusonline = JSON.parse(localStorage.getItem('user-status'));
    this.sendUserStatus.subscribe((res)=>{
      console.log(res)
      localStorage.setItem('user-status', JSON.stringify(res));
    })
    this.lastuserintegration="Select integration";
    this.route.queryParams
      .subscribe(params => {
       if(params.code!=null)
       {
         this.pageTitle="Dashboard"
       }
       else{
        this.url= window.location.href;
        let locID = this.url.split('/');
        this.pageTitle=locID[3].charAt(0).toUpperCase() + locID[3].slice(1);
       }
      });
   
      this.authService.user.subscribe((r: any) => {
      console.log('App component Auth Service', r);
        this.user = r;

      });
   

    this.authService.accessToken.subscribe((res: any) => {
 
      if (res) {
       
        this.accessToken=res
        this.token = res.access_token;
        this.apiService.getCurrentUser(this.token).subscribe((r: any) => {
          r.api_token = this.token;
          r.color = color.default(r.profile.first_name + r.profile.last_name);
          this.authService.user.next(r);
          this.cookie.set('gigaaa_user', JSON.stringify(r));
          this.cookie.set('access_token_active', JSON.stringify(res));
          this.oAuthService.login().finally(()=>{
           localStorage.setItem('gigaaa-socket', JSON.stringify(false));
            this.socketapi.closewebsocketcalls();
            this.agentsocketapi.closeagentsocket();
            this.getallintegrationlist();
          })
       this.router.navigate(['/dashboard']);
        });
      }
    
    });
    this.getuserloggedinstatus()
  }

  addNewRouteName(event: any) {
    
    this.pageTitle = event;
  }

  isSlideOpened(slideOpened: any) {
    console.log(slideOpened)
  
    this.slideOpened = slideOpened;
  }

  onNoLoggedUsers(event: any) {
    console.log(event)
    if (event) {
    
      this.agentsocketapi.closeagentsocket();
      this.socketapi.closewebsocketcalls();
      this.authService.logOff();
      this.oAuthService.logOff();
      location.href = this.redirectUri;
    }
  }

  onAddAnotherAccount(event: any) {
    this.hideTopbar=false
    const callLogin = new LoginBtnComponent(this.cookie);
    const action: string = 'add';
    if (event) {
      callLogin.generateChallenge(action);
    }
  }

  onSignin(event: any) {
  this.hideTopbar=false
    const callLogin = new LoginBtnComponent(this.cookie);
    const action: string = 'add';
    if (event) {
      callLogin.generateChallenge(action);
    }
  }

 // get all integration
  getallintegrationlist()
  {
   try {
  const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
  var accesstoken=getdata.access_token;
  var uuid=getdata.subscription_id.subsid.uuid;
  this.apiService.getallintegration(accesstoken,uuid).subscribe(data=>{
  
  this.integration=data;
  if(this.integration.length!=0)
  {
  this.integration.forEach(element => {
    if(element.last_used===true)
    { 
      localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
      this.lastuserintegration=element.name;
      this.apiService.getloggedinagentuuid(accesstoken,uuid,element?.uuid).subscribe(data=>{
        console.log(data);
        localStorage.setItem('userlogged_uuid', JSON.stringify(data));
          this.sharedres.getcallsocketapi(1);
        });
    }
  });
  let updatearr = this.integration.map((item, i) => Object.assign(item,{ routeUrl: ['/intents']}));
   let update_integration_list = updatearr;
  this.sidebarData.forEach(element => {
    if(element.dropdown==true)
    {
      element.dropdownItems=update_integration_list;
      element.name=this.lastuserintegration;
   }
  });
}
else 
{
  this.sidebarData.forEach(element => {
    if(element.name==this.lastuserintegration)
    {

      this.lastuserintegration="No Integration";
      element.name=this.lastuserintegration;
      element.dropdownItems=[];
      localStorage.removeItem('intgid');
      localStorage.removeItem('userlogged_uuid');
      this.showonlinetatus(false)
   }
  });
}
  });
 // this.setloggedINUUid();

} catch (error) {
  this.handleLoginRegisterError(error.error.error);
}
}
private handleLoginRegisterError(response: any) {
  console.log(response)
      this.messegeService.setErrorMessage(response.error.error, 'toast-bottom-right');
}
showonlinetatus(value:boolean){
  
  if(value==true)
  { 

    this.online_status="Online"
    this.statusonline=true;
  }
  else if(value==false)
  {
    this.online_status="Away"
     this.statusonline=false;

  }
 
 }
 // get last used integration
 getintegrationlist()
 {
  try {
 const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
 var accesstoken=getdata.access_token;
 var uuid=getdata.subscription_id.subsid.uuid;
 this.apiService.getallintegration(accesstoken,uuid).subscribe(data=>{
 
 this.integration=data;
 if(this.integration.length!=0)
 {
 this.integration.forEach(element => {
   if(element.last_used===true)
   {       
     localStorage.setItem('intgid', JSON.stringify({int_id:element.uuid,name:element.name}));
     this.lastuserintegration=element.name;

   }
 });
 let updatearr = this.integration.map((item, i) => Object.assign(item,{ routeUrl: ['/intents']}));
  let update_integration_list = updatearr;
 this.sidebarData.forEach(element => {
   if(element.dropdown==true)
   {
     element.dropdownItems=update_integration_list;
     element.name=this.lastuserintegration;
   }
 });
 }
 });
// this.setloggedINUUid();

} catch (error) {
 this.handleLoginRegisterError(error.error.error);
}
}
 // get the online status when agent is online or away.
 getuserloggedinstatus()
 {    
   this.sharedres.runthesocketforagent$.subscribe(data=>{

    this.getintegrationlist();
    const status = JSON.parse(localStorage.getItem('user-status'))
    if(data==1)
    {  
   
    this.showonlinetatus(status);
    this.hideTopbar=true;
    }

  });
 }

 public setonlinestatus(e)
{

  console.log(e)
    localStorage.setItem('user-status', JSON.stringify(e));
 
    if(e==true)
    {
      this.showonlinetatus(true)
      this.agentsocketapi.send_isonline_status(true);
    }
    else if(e==false)
    {
      this.showonlinetatus(false)
      this.agentsocketapi.send_isonline_status(false);

    }
    }
public openwebsites(val)
{
  window.open(val, '_blank');
}
// sidebar open collapse
isSidebarOpen(event: any) {
  console.log('Is sidebar open', event);
}

}
