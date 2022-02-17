import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { CookieService } from 'ngx-cookie-service';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/User';
import { agentsocketapi } from '../service/agentsocketapi';
import { AuthService } from '../service/auth.service';
import { GigaaaApiService } from '../service/gigaaaapi.service';
import { gigaaasocketapi } from '../service/gigaaasocketapi.service';
import { MessageService } from '../service/messege.service';
import { sharedres_service } from '../service/sharedres.service';
import { LoginBtnComponent } from '../useraccount/landingpage/login-btn/login-btn.component';

@Component({
  selector: 'app-maincomponent',
  templateUrl: './maincomponent.component.html',
  styleUrls: ['./maincomponent.component.css']
})
export class MaincomponentComponent implements OnInit {

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
  ) { router.initialNavigation();
  
  }

 

  ngOnInit(): void {
    let userData=localStorage.getItem('gigaaa-user');
     
    let data=JSON.parse(userData);
    if(data!=null)
    {
     let Resp= this.authService.userRestriction(data.api_token);
     if(Resp==true)
     {
      this.router.navigate(['checkUser'])

     }
    }
    
    
    
  
 

  
  }

  

}
