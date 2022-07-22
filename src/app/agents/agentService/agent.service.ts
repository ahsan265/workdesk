import { Injectable } from '@angular/core';
import { OneSelect } from 'src/app/models/oneSelect';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { selectedAgentType } from '../agentsData';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private AgentSocketService: AgentSocketService) { }
  // send agent params from agent component using service

  public sendAgentDefaultParameter(languages: number[], active: number, inactive: number, invited: number) {
    this.AgentSocketService.sendAgentsParameter({
      active: active,
      inactive: inactive,
      invited: invited,
      languages: languages
    })
  }
  // caculate the agent type 
  public getAgenttypeParameter(agentTypeSelected: OneSelect) {
    const selectedType: any = selectedAgentType.find((typeSelected: any) => typeSelected.name === agentTypeSelected.name);
    return selectedType.options;
  }


}
