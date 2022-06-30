import { RouterModule, Routes } from '@angular/router';
import { AgentsComponent } from './agents/agents.component';
import { AnsweredComponent } from './calls/answered/answered.component';
import { CallsComponent } from './calls/calls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomingComponent } from './calls/incoming/incoming.component';
import { MissedComponent } from './calls/missed/missed.component';
import { NgModule } from '@angular/core';
import { OngoingComponent } from './calls/ongoing/ongoing.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
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
