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
  searchInputData,
  agentIndicatorData,
  noAgentTobaleData,
  onlineStatuses
} from './agentsData';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { OneSelect } from '../models/oneSelect';
import { AgentService } from './agentService/agent.service';
import { AgentSocketService } from '../workdeskSockets/agentSocket/agent-socket.service';
import { AgentList } from '../models/agentSocketModel';
import { Router } from '@angular/router';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { AgentModelTable } from '../models/callModel';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { callsIndicatorData } from '../models/callIndicatorModel';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { AddAgentComponent } from '../modals/add-agent/add-agent.component';
import { MessageService } from '../workdeskServices/messageService/message.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  noAgentTobaleData = noAgentTobaleData;
  languauges = languauges;
  searchInputData = searchInputData;
  oneSelectData = oneSelect;
  onlineStatuses = onlineStatuses;
  buttonData = buttonData;
  tableSetting = agentTableSetting;
  addAgentModelData = agentModelData;
  agentdata: AgentModelTable[] = [];
  agentdataWithNoSearch: AgentModelTable[] = [];
  agentIndicator: callsIndicatorData = agentIndicatorData;
  selectedLanguages: Array<number> = [];
  activeAgent: number = 1;
  inactiveAgent: number = 1;
  invitedAgent: number = 1;
  showInviteModel: boolean = false;
  selectedStatus: OneSelect = onlineStatuses[0];
  AgentList: AgentList[] = [];
  dialog: any;
  searchedValue: string = '';

  constructor(
    private authService: AuthService,
    private CommonService: CommonService,
    private AgentService: AgentService,
    private router: Router,
    private AgentSocketService: AgentSocketService,
    private SharedServices: SharedServices,
    private MessageService: MessageService,
    private OverlayService: OverlayService) {
    this.authService.pageTitle.next('Agents');
  }
  ngOnInit(): void {
    this.callCommonEndpoints();
    this.getAgentList();
    this.AgentSocketService.getLastUsedParams();
    this.SharedServices.LoadcommonEpsubject.subscribe((data) => {
      if (data === 1) {
        this.oneSelectData.map((data => {
          (data.id === 1) ? data.selected = true : data.selected = false;
        }))
        this.callCommonEndpoints();
        this.selectedStatus = onlineStatuses[0];
        this.selectedLanguages = [];
        this.searchInputData.searchText = '';

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
      this.selectedLanguages,
      this.activeAgent,
      this.invitedAgent
    );
  }
  public agentTypeOutput(agentType: OneSelect) {
    const selectedType = this.AgentService.getAgenttypeParameter(agentType);
    this.activeAgent = selectedType.active;
    this.invitedAgent = selectedType.invited;
    this.AgentService.sendAgentDefaultParameter(
      this.selectedLanguages,
      selectedType.active,
      selectedType.invited
    );
  }
  // get agent status data 
  public agentStatusOutput(agentType: OneSelect) {
    this.selectedStatus = agentType;
    const dataStatusWise = this.agentdataWithNoSearch.filter(data => {
      if (agentType.id === 2) {
        return data.is_online_icon_color === '#3EDE26';
      }
      else if (agentType.id === 3) {
        return data.is_online_icon_color === '#FF155A';
      }
      else {
        return data;
      }
    })
    this.agentdata = dataStatusWise;
  }
  showInviteModal() {
    if (this.buttonData.active === true) {
      if (this.AgentSocketService.freeSeatsInformation.getValue()) {
        this.OverlayService.open({
          component: AddAgentComponent,
          panelClass: 'addAgent',
          hasBackdrop: true,
          backdropClass: 'dark-backdrop'
        })
      }
      else {
        this.MessageService.setErrorMessage('No more available seats.');
      }
    }
  }

  onCloseAgentInvite(event: any) {
    if (event) {
      this.showInviteModel = false;
    }
  }
  getAgentList() {
    this.AgentSocketService.AgentListSubject.subscribe((data: AgentList[]) => {
      this.AgentList = this.AgentService.getAgentWiseData(data);
      this.agentdata = this.AgentList.map((AgentList: AgentList) => ({
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
        ) === true ? '#3EDE26' : '#FF155A',
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
        invitation_accepted: this.AgentService.setAgentInActiveProperty(
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
        edit_icon:
          (AgentList.inactive === true && AgentList.active === true) ? '../assets/images/reactivate.svg' : '../assets/images/pencil.svg',
        routeUrl: ['agents', 'settings', AgentList.uuid]
      }));
      this.agentdataWithNoSearch = this.agentdata;
      this.CommonService.getLoggedInAgentData().role === 'Agent' ? this.buttonData.active = false : this.buttonData.active = true;
      this.agentIndicator = {
        hightlightText: this.AgentService.countOnlineAgentsAvailable(data) + "",
        text: '',
        icon: '../assets/images/components/agent_free.svg',
        backgroundColor: '#FEFEFF',
        borderColor: '1px solid #E1E1EA',
        textColor: '#737D8D',
        isAgent: true
      };
      this.agentStatusOutput(this.selectedStatus);
    });


  }

  getSettingsPage(event: string[]) {

    const data = this.AgentService.getAgentByUuid(event[2], this.AgentList);
    const FreeSeats = this.AgentSocketService.freeSeatsInformation.getValue();
    if (data?.inactive === true && data.active === true) { (FreeSeats) ? this.AgentService.setAgentActive(data.uuid, false) : this.MessageService.setErrorMessage('No more available seats.'); }
    else {
      this.router.navigate(event);
    }

  }

  // get searched Value 
  public getSearchValue(value: string) {
    this.agentdata = this.AgentService.search(value, this.agentdata, this.agentdataWithNoSearch);
    if (value.length === 0 && this.agentdata.length === 0) {
      this.agentdata = this.agentdataWithNoSearch
    }
  }


}
