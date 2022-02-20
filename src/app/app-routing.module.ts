import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Routes, RouterModule, RouterLink, Router } from '@angular/router';
import { GigaaaApiService } from './service/gigaaaapi.service';
import { MessageService } from './service/messege.service';
import { UserloginserviceService } from './service/userloginservice.service';
import { AuthService } from './service/auth.service';
import { LandingpageComponent } from './useraccount/landingpage/landingpage.component';
import { AppComponent } from './app.component';
import { CallbackComponent, LogoutComponent } from '@gigaaa/gigaaa-components';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { User } from './model/User';
import { retry } from 'rxjs/operators';
import { MaincomponentComponent } from './maincomponent/maincomponent.component';

const routes: Routes = [
  {path:'',component:LandingpageComponent,},
  { path: "logout", component: LogoutComponent },

  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./workdesk/workdesk.module').then(
            (module) => module.WorkdeskModule
          ),
      },
    ],
    canActivate: [AuthService],
  
  },
  { path: "callback", component: CallbackComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ relativeLinkResolution: 'legacy',initialNavigation: 'disabled'})],
  exports: [RouterModule],
  providers: [
    AuthService,
    GigaaaApiService,
    MessageService,
  ],
})
export class AppRoutingModule {



}




