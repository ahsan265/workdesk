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
import { gigaaasocketapi } from './service/gigaaasocketapi.service';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { abort } from 'process';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  integration:any;
  lastuserintegration:any="";
  integration_id:any;
  pageTitle: string;
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
    { iconUrl: this.select_integration_icon, name:"Select integration", dropdownItems:[], dropdown: true ,      isLink: false
  },
    {
      iconUrl: this.dashboardIcon,
      activeIconUrl: this.activedashboardIcon,
      name: 'Dashboard',
      routeUrl: ['/dashboard'],
      dropdown: false,
      isLink: true

    },
    {
      iconUrl: this.callIcon,
      activeIconUrl: this.activeCallIcon,
      name: 'Calls',
      routeUrl: ['/calls'],
      dropdown: false,
      isLink: true

    },
    {
      iconUrl: this.agentIcon,
      activeIconUrl: this.activeAgentIcon,
      name: 'Agents',
      routeUrl: ['/agents'],
      dropdown: false,
      isLink: true

    },
  ];
  slideOpened: boolean = false;
  oauthUrl = `${environment.accounts_url}`;
  token: string;
  online_status:any;
  statusonline:boolean;
  accessToken;
  user: User;
  url:String;
  hideTopbar:boolean=false;
  isload:boolean=false;
  constructor(
    public authService: AuthService,
    private apiService: GigaaaApiService,
    private cookie: CookieService,
    private share_res:sharedres_service,
    private messegeService:MessageService,
    private agentsocketapi:agentsocketapi,
    private socketapi:gigaaasocketapi,
    private sharedres:sharedres_service,
    private router: Router,
    private route:ActivatedRoute,
    private headerService: GigaaaHeaderService
  ) {
  
  }
  sendUserStatus = new ReplaySubject(1);
  expiredDate:any

  ngOnInit(): void {
          this.getuserloggedinstatus();
          this.getagentlistOnload()
          this.statusonline = JSON.parse(localStorage.getItem('user-status'));
          this.sendUserStatus.subscribe((res)=>{
            localStorage.setItem('user-status', JSON.stringify(res));
          })
           this.lastuserintegration="Select integration";
           this.route.url
           .subscribe(params => {
            let loc=window.location;
          let path= loc.pathname.replace("/", "");
          console.log(path)
            if(path=="callback")
            {
              this.pageTitle="Dashboard";
           
            }
        
            else 
            {
              this.url= window.location.href;
              let locID = this.url.split('/');
              this.pageTitle=locID[3].charAt(0).toUpperCase() + locID[3].slice(1);
            }
          });
       
       
        

         this.authService.user.subscribe(r=>{
          let user= r;
          if(user!=null)
          {
            this.authService.getOrganizationId(user.api_token);
            this.authService.getinvitationToken(user.api_token);
          }
         
        })


      
  }

  addNewRouteName(event: any) {
    
    this.pageTitle = event;
  }

  isSlideOpened(slideOpened: any) {
    this.slideOpened = slideOpened;
  }

  onNoLoggedUsers(event: any) {
    if (event) {
      console.log(event)
      localStorage.clear();
      this.agentsocketapi.closeagentsocket();
      this.socketapi.closewebsocketcalls();
      location.href = this.redirectUri;
      
    }
  }

  onAddAnotherAccount(event: any) {
    this.agentsocketapi.closeagentsocket();
    this.socketapi.closewebsocketcalls();
    const callLogin = new LoginBtnComponent(this.cookie);
    const action: string = 'add';
    if (event) {
      callLogin.generateChallenge(action);
    }
  }

  onSignin(event: any) {
    this.agentsocketapi.closeagentsocket();
    this.socketapi.closewebsocketcalls();
    const callLogin = new LoginBtnComponent(this.cookie);
    const action: string = 'add';
    if (event) {
      callLogin.generateChallenge(action);
    }
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
        const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
        var accesstoken=getdata.api_token;
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
        },err=>{
          this.messegeService.setErrorMessage(err.error.error);
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

        } catch (error) {
          //this.messegeService.setErrorMessage(error);

        }

        }
// show top and sidebar
getagentlistOnload()
{
      this.sharedres.showagentListonloadSubject.subscribe(data=>{
      if(data==1)
      {
      this.getintegrationlist()
      }
   
  })

}
 // get the online status when agent is online or away.
 getuserloggedinstatus()
 {    
    this.sharedres.runthesocketforagent_subject.subscribe(data=>{
    const status = JSON.parse(localStorage.getItem('user-status'))
    if(data==1)
    {
    this.showonlinetatus(status);
    }

  });
 }

 public setonlinestatus(e)
{
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
}

onLoginClicked(event: boolean) {
  if (event) {
    console.log(event)
    this.headerService.login();
    }
}
onGetLoggedUser(user: any) {
  if (user) {
    this.authService.user.next(user);
    this.token = user.api_token;
  }
}


    // get integration callBack fucntion
    getselectedDropdownItem(event: any) {
      this.getintegration(event?.name,event?.uuid);
    }   

    // setIntergration 
    public async   getintegration(val,int_id):Promise<any>
    { 
      localStorage.setItem('intgid', JSON.stringify({int_id:int_id,name:val}));
      this.socketapi.closewebsocketcalls();
      this.agentsocketapi.closeagentsocket();
      const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
      let accesstoken=getdata?.api_token;
      let uuid=getdata?.subscription_id?.subsid.uuid;
 
       await  this.apiService.updatelastusedintegration(accesstoken,uuid,{"integration": int_id});
       await this.authService.getLOggedinUserUuid(accesstoken,uuid,int_id);
     
    }
}
