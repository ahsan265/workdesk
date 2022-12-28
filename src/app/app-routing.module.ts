import { CallbackComponent, LogoutComponent } from '@gigaaa/gigaaa-components';
import { RouterModule, Routes } from '@angular/router';
import { AgentSettingsComponent } from './agent-settings/agent-settings.component';
import { AgentsComponent } from './agents/agents.component';
import { AnsweredComponent } from './calls/answered/answered.component';
import { AuthService } from './services/auth.service';
import { CallsComponent } from './calls/calls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomingComponent } from './calls/incoming/incoming.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { MissedComponent } from './calls/missed/missed.component';
import { NgModule } from '@angular/core';
import { OngoingComponent } from './calls/ongoing/ongoing.component';
import { CallConsoleComponent } from './callInterface/call-console/call-console.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

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
          { path: 'incoming', component: IncomingComponent, data: {}, pathMatch: 'full' },
          { path: 'ongoing', component: OngoingComponent, data: {}, pathMatch: 'full' },
          {
            path: 'missed',
            component: MissedComponent,
            data: { missedData: '', pathMatch: 'full' }
          },
          { path: 'answered', component: AnsweredComponent, data: {}, pathMatch: 'full' }
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


  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false, // <-- debugging purposes only
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
