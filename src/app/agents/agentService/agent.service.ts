/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { InviteAgentModel, UtlitiesIcon } from 'src/app/models/agent';
import { AgentLanguages, AgentList } from 'src/app/models/agentSocketModel';
import { OneSelect } from 'src/app/models/oneSelect';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { languauges, selectedAgentType } from '../agentsData';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(
    private AgentSocketService: AgentSocketService,
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private MessageService: MessageService
  ) {}
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
    displayName: string
  ) {
    if (invited == true && inactive == false && active == false) {
      return 'Not joined yet';
    } else {
      return displayName;
    }
  }
  public disabledEditButton(
    email: string,
    isOrganizationAdmin: boolean,
    role: string
  ): boolean {
    if (
      this.AgentSocketService.getOrganizationAdminStatus()
        .is_organization_admin === true
    ) {
      return true;
    } else if (
      this.AgentSocketService.getOrganizationAdminStatus()
        .is_organization_admin === false &&
      this.AgentSocketService.getOrganizationAdminStatus().role === 'Admin'
    ) {
      if (isOrganizationAdmin === true && role === 'Admin') {
        return false;
      } else {
        return true;
      }
    } else if (
      this.AgentSocketService.getOrganizationAdminStatus()
        .is_organization_admin === false &&
      this.AgentSocketService.getOrganizationAdminStatus().role === 'Agent'
    ) {
      if (this.checkIsLoggedInAgent(email) === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  // check is user LoggedIn agent
  public checkIsLoggedInAgent(agentEmail: string) {
    const userInfo: User = JSON.parse(
      localStorage.getItem('gigaaa-user') || '{}'
    );
    return userInfo.email === agentEmail ? true : false;
  }

  // set Agent Invited property
  public setAgentInvitedProperty(
    invited: boolean,
    inactive: boolean,
    active: boolean
  ) {
    if (invited == true && inactive == false && active == false) {
      return false;
    } else {
      return true;
    }
  }
  // send Invitation to agent
  private async sendInvitationToAgent(agentsInformation: InviteAgentModel) {
    try {
      await this.GigaaaApiService.getinviteagent(
        this.CommonService.getEndpointsParamLocal().token,
        this.CommonService.getEndpointsParamLocal().organization,
        this.CommonService.getEndpointsParamLocal().project,
        agentsInformation
      );
    } catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error);
    }
  }

  // set Validation for Add agent

  public async validateAgent(agentsInformation: InviteAgentModel) {
    let ids: number[] = [];
    if (agentsInformation.language_ids === undefined) {
      ids = [];
      if (ids.length === 0) {
        this.MessageService.setErrorMessage('Please enter valid information');
      }
    } else {
      await this.sendInvitationToAgent(agentsInformation);
    }
  }

  getLanguageFlagById(languages: AgentLanguages[]): UtlitiesIcon[] {
    let UtlitiesIcon: UtlitiesIcon[] = [];
    languages.forEach((data) => {
      UtlitiesIcon.push({
        image: this.CommonService.getLanguageFlags(data.id)
      });
    });
    return UtlitiesIcon;
  }

  // get agent role
  public getAgentRole(
    isOrganizationAdmin: boolean,
    isOrganizationOwner: boolean,
    role: string
  ) {
    if (
      isOrganizationAdmin === true &&
      isOrganizationOwner === true &&
      role === 'Admin'
    ) {
      return 'Owner';
    } else if (
      isOrganizationAdmin === true &&
      isOrganizationOwner === false &&
      role === 'Admin'
    ) {
      return 'Admin';
    } else if (
      isOrganizationAdmin === false &&
      isOrganizationOwner === false &&
      role === 'Admin'
    ) {
      return 'Admin';
    } else {
      return 'Agent';
    }
  }

  // check agent is in call or chat

  public checkAgentInCallChat(isInCall: boolean, isInChat: boolean) {
    if (isInCall === true && isInChat === false) {
      return '../assets/images/request_type/call_icons.svg';
    } else if (isInCall === false && isInChat === true) {
      return '../assets/images/request_type/chat_icons.svg';
    } else {
      return '';
    }
  }
}
