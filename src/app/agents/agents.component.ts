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
  selectedLanguages: Array<number> = [];
  activeAgent: number = 1;
  inactiveAgent: number = 1;
  invitedAgent: number = 1;
  showInviteModel: boolean = true;
  AgentList: AgentList[] = [];
  constructor(
    private authService: AuthService,
    private CommonService: CommonService,
    private AgentService: AgentService,
    private router: Router,
    private AgentSocketService: AgentSocketService,
    private openCallInterface: OverlayService
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
    //this.openCallInterface.open();
    this.showInviteModel === true
  }

  getAgentList() {
    this.AgentSocketService.AgentListSubject.subscribe((data: AgentList[]) => {
      this.agentdata = data.map((AgentList: AgentList) => ({
        // id: AgentList.uuid,
        // agent: AgentList.email,
        // name: this.AgentService.getAgentFullName(
        //   AgentList.invited,
        //   AgentList.inactive,
        //   AgentList.active,
        //   AgentList.first_name,
        //   AgentList.last_name
        // ),
        // role: AgentList.role,
        // routeUrl: ['agents', 'settings', AgentList.uuid],
        // checked: AgentList.inactive,
        // isDropdown: false,
        // language_id: this.CommonService.getLanguagesWithFlags(
        //   AgentList.languages
        // ),
        // editIcon: this.AgentService.disabledEditButton(AgentList.email, AgentList.is_organization_admin, AgentList.role),
        // canEdit: true,
        // invitation_accepted: this.AgentService.setAgentInvitedProperty(AgentList.invited, AgentList.inactive, AgentList.active),
        // checkmark: this.CommonService.checkLoggedInUser(AgentList.email),
        // userItem: {
        //   text: AgentList.display_name,
        //   image: AgentList.images['96'],
        //   color: this.AgentService.checkIsAgentOnline(
        //     AgentList.is_available,
        //     AgentList.is_online
        //   )
        // }

        /////////////////
        uuid: AgentList.uuid,
        activity_icon: "../assets/images/request_type/audio.svg",
        agent_details: { image: AgentList.images['96'], text: AgentList.first_name + " " + AgentList.last_name },
        agent_name: AgentList.display_name,
        can_edit: this.AgentService.disabledEditButton(AgentList.email, AgentList.is_organization_admin, AgentList.role),
        email: AgentList.email,
        is_logged_in: this.CommonService.checkLoggedInUser(AgentList.email),
        is_online_icon_color: this.AgentService.checkIsAgentOnline(
          AgentList.is_available,
          AgentList.is_online
        ),
        role: AgentList.role,
        show_edit: this.AgentService.disabledEditButton(AgentList.email, AgentList.is_organization_admin, AgentList.role),
        utilites: this.AgentService.getLanguageFlagById(AgentList.languages),
        invitation_accepted: this.AgentService.setAgentInvitedProperty(AgentList.invited, AgentList.inactive, AgentList.active),
        is_organization_admin: AgentList.is_organization_admin,
        loggedIn_user_icon: '../assets/images/tickSign.svg',
        organization_admin_icon: '../assets/images/crown.svg',
        edit_icon: '../assets/images/pencil.svg',
        routeUrl: ['agents', 'settings', AgentList.uuid]
      }));
    });
  }

  getSettingsPage(event: string[]) {
    this.router.navigate(event);
  }
}
