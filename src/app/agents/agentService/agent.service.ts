/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { AgentList } from 'src/app/models/agentSocketModel';
import { OneSelect } from 'src/app/models/oneSelect';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { selectedAgentType } from '../agentsData';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(private AgentSocketService: AgentSocketService) {}
  // send agent params from agent component using service

  public sendAgentDefaultParameter(
    languages: number[],
    active: number,
    inactive: number,
    invited: number
  ) {
    this.AgentSocketService.sendAgentsParameter({
      active: active,
      inactive: inactive,
      invited: invited,
      languages: languages
    });
  }
  // caculate the agent type
  public getAgenttypeParameter(agentTypeSelected: OneSelect) {
    const selectedType: any = selectedAgentType.find(
      (typeSelected: any) => typeSelected.name === agentTypeSelected.name
    );
    return selectedType.options;
  }

  public getSelectedAgent(ListOfAgents: AgentList[], agentUuid: string) {
    const selectedAgent: any = ListOfAgents.find((data: AgentList) => {
      data.uuid == agentUuid;
    });
    return selectedAgent;
  }

  public checkIsAgentOnline(is_available: boolean, is_online: boolean) {
    return is_available === true && is_online === true ? '#3EDE26' : '#FF155A';
  }

  public getAgentFullName(
    invited: boolean,
    inactive: boolean,
    active: boolean,
    first_name: string,
    last_name: string
  ) {
    if (invited == true && inactive == false && active == false) {
      return 'Not joined yet';
    } else {
      return first_name + ' ' + last_name;
    }
  }
}
