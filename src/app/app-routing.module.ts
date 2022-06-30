import { CallbackComponent, LogoutComponent } from '@gigaaa/gigaaa-components';
import { RouterModule, Routes } from '@angular/router';
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
          { path: 'incoming', component: IncomingComponent },
          { path: 'ongoing', component: OngoingComponent },
          { path: 'missed', component: MissedComponent },
          { path: 'answered', component: AnsweredComponent }
        ]
      },
      { path: 'agents', component: AgentsComponent }
    ]
  },
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: '' }
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
export class AppRoutingModule {}
