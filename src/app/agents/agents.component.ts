/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import {
  agentModelData,
  agents,
  buttonData,
  dataTableSettings,
  languauges,
  oneSelect,
  searchInputData
} from './agentsData';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { OneSelect } from '../models/oneSelect';
import { AgentService } from './agentService/agent.service';
import { AgentSocketService } from '../workdeskSockets/agentSocket/agent-socket.service';
import { AgentList } from '../models/agentSocketModel';
import { Router } from '@angular/router';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { OverlayService } from '../callInterface/overLayService/overlay.service';

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
  addAgentModelData = agentModelData;
  agents = agents;
  selectedLanguages: Array<number> = [];
  activeAgent: number = 1;
  inactiveAgent: number = 1;
  invitedAgent: number = 1;
  showInviteModel: boolean = false;
  AgentList: AgentList[] = [];
  constructor(
    private authService: AuthService,
    private CommonService: CommonService,
    private AgentService: AgentService,
    private router: Router,
    private AgentSocketService: AgentSocketService,
    private openCallInterface:OverlayService
  ) {
    this.authService.pageTitle.next('Agents');
  }
  ngOnInit(): void {
    this.callCommonEndpoints();
    this.getAgentList();
    this.AgentSocketService.getLastUsedParams();
  }
  private async callCommonEndpoints() {
    this.languauges = await this.CommonService.getLanguages();
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
  showInviteModal() {
    // if (this.AgentList.length != 0) {
    //   const selectedAgent: AgentList | undefined = this.AgentList.find(
    //     (data: AgentList) =>
    //       data.uuid === 'ed4f6baf-c7ad-480e-9fa7-ba48ff9d4347'
    //   );
    //   this.router.navigate(['agents', 'settings', selectedAgent?.uuid]);
    // }
    this.openCallInterface.open()
    
  }

  getAgentList() {
    this.AgentSocketService.AgentListSubject.subscribe((data: AgentList[]) => {
      this.AgentList = data;
    });
  }
}
