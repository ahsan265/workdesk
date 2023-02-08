import { CallbackComponent, LogoutComponent } from '@gigaaa/gigaaa-components';
import { RouterModule, Routes } from '@angular/router';
import { AgentSettingsComponent } from './agent-settings/agent-settings.component';
import { AgentsComponent } from './agents/agents.component';
import { AuthService } from './services/auth.service';
import { CallsComponent } from './calls/calls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { CallConsoleComponent } from './callInterface/call-console/call-console.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { IncomingComponent } from './calls/incoming/incoming/incoming.component';
import { OngoingComponent } from './calls/ongoing/ongoing/ongoing.component';
import { MissedComponent } from './calls/missed/missed/missed.component';
import { AnsweredComponent } from './calls/answered/answered/answered.component';
import { AccountNotpartComponent } from './modals/account-not-part/account-notpart.component';
import { CanloadService } from './services/canLoad/canload.service';
import { CommonService } from './workdeskServices/commonEndpoint/common.service';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'calls',
        component: CallsComponent,
        children: [
          { path: '', redirectTo: 'incoming', pathMatch: 'full' },
          { path: 'incoming', component: IncomingComponent },
          { path: 'ongoing', component: OngoingComponent },
          { path: 'missed', component: MissedComponent },
          { path: 'answered', component: AnsweredComponent }
        ]
      },
      { path: 'agents', component: AgentsComponent },
      { path: 'agents/settings/:id', component: AgentSettingsComponent }

    ]
  },
  { path: 'callback', component: CallbackComponent },
  { path: 'calling', component: CallConsoleComponent, canActivate: [AuthService] },
  { path: 'customersupport', component: CustomerSupportComponent, canActivate: [AuthService] },
  {
    path: 'loading', component: LoaderComponent, canActivate: [AuthService]
  },

  { path: 'noaccount', component: AccountNotpartComponent },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false, // <-- debugging purposes only
      scrollPositionRestoration: 'disabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
