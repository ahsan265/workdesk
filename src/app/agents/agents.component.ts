/* eslint-disable no-unused-vars */
import {
  agents,
  buttonData,
  dataTableSettings,
  languauges,
  oneSelect,
  searchInputData,
} from './agentsData';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonEndpoints } from '../commonEndpoints/commonEndpoint';
import { OneSelect } from '../models/oneSelect';
import { AgentService } from './agentService/agent.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  languauges = languauges;
  searchInputData = searchInputData;
  oneSelectData = oneSelect;
  buttonData = buttonData;
  dataTableSettings = dataTableSettings;
  agents = agents;
  selectedLanguages: Array<number> = [];
  activeAgent: number = 1;
  inactiveAgent: number = 1;
  invitedAgent: number = 1;

  constructor(
    private authService: AuthService,
    private commonEndpoints: CommonEndpoints,
    private AgentService: AgentService
  ) {
    this.authService.pageTitle.next('Agents');
  }
  ngOnInit(): void {
    this.callCommonEndpoints();
  }
  private async callCommonEndpoints() {
    this.languauges = await this.commonEndpoints.getLanguages();
  }
  public langugaOutput(languaugesOutput: number[]) {
    this.selectedLanguages = languaugesOutput;
    this.AgentService.sendAgentDefaultParameter(
      languaugesOutput,
      this.activeAgent,
      this.inactiveAgent,
      this.invitedAgent
    );
  }
  public agentTypeOutput(agentType: OneSelect) {
    const selectedType = this.AgentService.getAgenttypeParameter(agentType);
    this.activeAgent = selectedType.active;
    this.inactiveAgent = selectedType.inactive;
    this.invitedAgent = selectedType.invited;
    this.AgentService.sendAgentDefaultParameter(
      this.selectedLanguages,
      selectedType.active,
      selectedType.inactive,
      selectedType.invited
    );
  }
}
