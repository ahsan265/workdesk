import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ActivechatComponent } from './activechat/activechat.component';
import { AgentComponent } from './agents/agent.component';
import { ChatComponent } from './call/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewchatComponent } from './visitors/viewchat.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthService] },
  { path: 'agents', component: AgentComponent,canActivate:[AuthService]},
  { path: 'calls', component: ChatComponent ,canActivate:[AuthService]},
  { path: 'visitor', component: ViewchatComponent,canActivate:[AuthService]},
  { path: 'activechat', component: ActivechatComponent,canActivate:[AuthService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkdeskRoutingModule {}
