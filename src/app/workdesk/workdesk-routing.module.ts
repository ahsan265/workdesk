import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AgentComponent } from './agents/agent.component';
import { AgentsettingsComponent } from './agents/agentsettings/agentsettings.component';
import { ChatComponent } from './call/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
 
  { path: 'dashboard/:id', component: DashboardComponent,canActivate:[AuthService] },
  { path: 'agents', component: AgentComponent,canActivate:[AuthService],
    children:[
    { path:':id/:uuid',component: AgentComponent}]
  },
  { path: 'calls/:id', component: ChatComponent ,canActivate:[AuthService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkdeskRoutingModule {}
