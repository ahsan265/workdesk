/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import {
  agentModelData,
  agents,
  buttonData,
  agentTableSetting,
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
import { AgentModelTable } from '../models/callModel';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';

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
  tableSetting = agentTableSetting;
  addAgentModelData = agentModelData;
  agentdata: AgentModelTable[] = [];
  agentdataWithNoSearch: AgentModelTable[] = [];

  selectedLanguages: Array<number> = [];
  activeAgent: number = 1;
  inactiveAgent: number = 1;
  invitedAgent: number = 1;
  showInviteModel: boolean = false;
  AgentList: AgentList[] = [];
  dialog: any;
  constructor(
    private authService: AuthService,
    private CommonService: CommonService,
    private AgentService: AgentService,
    private router: Router,
    private AgentSocketService: AgentSocketService,
    private SharedServices: SharedServices
  ) {
    this.authService.pageTitle.next('Agents');
  }
  ngOnInit(): void {
    this.callCommonEndpoints();
    this.getAgentList();
    this.AgentSocketService.getLastUsedParams();
    this.SharedServices.LoadcommonEpsubject.subscribe((data) => {
      if (data === 1) {
        this.callCommonEndpoints();
      }
    });
    this.SharedServices.closeAddAgentDialog.subscribe((data) => {
      if (data) {
        this.showInviteModel = false;
      }
    })
  }
  private async callCommonEndpoints() {
    this.languauges = await this.CommonService.getProjectLanguages();
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
    if (this.buttonData.active) {
      this.showInviteModel = true;
    }
  }

  onCloseAgentInvite(event: any) {
    if (event) {
      this.showInviteModel = false;
    }
  }
  getAgentList() {
    this.AgentSocketService.AgentListSubject.subscribe((data: AgentList[]) => {
      const dataUpdate = this.AgentService.getAgentWiseData(data);
      this.agentdata = dataUpdate.map((AgentList: AgentList) => ({
        uuid: AgentList.uuid,
        activity_icon: this.AgentService.checkAgentInCallChat(
          AgentList.is_in_call,
          AgentList.is_in_chat
        ),
        agent_details: {
          image: AgentList.images['96'],
          text: AgentList.display_name
        },
        agent_name: this.AgentService.getAgentFullName(
          AgentList.invited,
          AgentList.inactive,
          AgentList.active,
          AgentList.first_name + ' ' + AgentList.last_name,
        ),
        can_edit: true,
        email: AgentList.email,
        is_logged_in: this.CommonService.checkLoggedInUser(AgentList.email),
        is_online_icon_color: this.AgentService.checkIsAgentOnline(
          AgentList.is_available,
          AgentList.is_online
        ),
        role:
          this.AgentService.setAgentInvitedProperty(
            AgentList.invited,
            AgentList.inactive,
            AgentList.active
          ) === true
            ? this.AgentService.getAgentRole(
              AgentList.is_organization_admin,
              AgentList.is_organization_owner,
              AgentList.role
            )
            : 'Pending',
        show_edit: AgentList.show_edit,
        utilites: this.AgentService.getLanguageFlagById(AgentList.languages),
        invitation_accepted: this.AgentService.setAgentInvitedProperty(
          AgentList.invited,
          AgentList.inactive,
          AgentList.active
        ),
        is_organization_admin:
          AgentList.is_organization_admin === true &&
            AgentList.is_organization_owner === false &&
            this.AgentService.setAgentInvitedProperty(
              AgentList.invited,
              AgentList.inactive,
              AgentList.active
            ) &&
            AgentList.role === 'Admin'
            ? true
            : false,
        loggedIn_user_icon: '../assets/images/tickSign.svg',
        organization_admin_icon: '../assets/images/crown.svg',
        edit_icon: '../assets/images/pencil.svg',
        routeUrl: ['agents', 'settings', AgentList.uuid]
      }));
      this.agentdataWithNoSearch = this.agentdata;
      this.CommonService.getLoggedInAgentData().role === 'Agent' ? this.buttonData.active = false : this.buttonData.active = true;
    });
  }

  getSettingsPage(event: string[]) {
    this.router.navigate(event);
  }

  // get searched Value 
  public getSearchValue(value: string) {
    this.agentdata = this.AgentService.search(value, this.agentdata, this.agentdataWithNoSearch);
    if (value.length === 0 && this.agentdata.length === 0) {
      this.agentdata = this.agentdataWithNoSearch
    }
  }


}
