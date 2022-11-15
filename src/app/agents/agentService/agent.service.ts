/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { AgentModelTable, InviteAgentModel, UtlitiesIcon } from 'src/app/models/agent';
import { AgentLanguages, AgentList } from 'src/app/models/agentSocketModel';
import { OneSelect } from 'src/app/models/oneSelect';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { selectedAgentType } from '../agentsData';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(
    private AgentSocketService: AgentSocketService,
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private MessageService: MessageService
  ) { }
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
  public getAgentWiseData(AgentList: AgentList[]) {
    AgentList.forEach(data => {
      if (this.checkIsLoggedInAgent(data.email)) {
        this.CommonService.loggedInAgentDetails(data);
      }
    })
    const data = this.CommonService.getLoggedInAgentData()
    if (data.role === 'Admin' && data.is_organization_admin === true && data.is_organization_owner === true) {
      AgentList.map((item) => Object.assign(item, { show_edit: true }));
      AgentList.forEach(element => {
        if (this.checkIsLoggedInAgent(element.email)) {
          let fromindex = AgentList.findIndex(
            (x) => x.email === this.CommonService.getEmailForLoggedInUser()
          );
          let selectedobject = AgentList[fromindex];
          AgentList.splice(fromindex, 1);
          AgentList.splice(0, 0, selectedobject);
        }
      });
    }
    else if (data.role === 'Admin' && data.is_organization_admin === true && data.is_organization_owner === false) {
      AgentList.map((item) => Object.assign(item, { show_edit: true }));
      AgentList.forEach(element => {
        if (element.role === "Admin" && element.is_organization_admin === true && element.is_organization_owner === true) {
          element['show_edit'] = false;
        }
        if (this.checkIsLoggedInAgent(element.email)) {
         // this.CommonService.loggedInAgentDetails(element);
          let fromindex = AgentList.findIndex(
            (x) => x.email === this.CommonService.getEmailForLoggedInUser()
          );
          let selectedobject = AgentList[fromindex];
          AgentList.splice(fromindex, 1);
          AgentList.splice(0, 0, selectedobject);
        }

      });
    }
    else if (data.role === 'Admin' && data.is_organization_admin === false && data.is_organization_owner === false) {
      AgentList.map((item) => Object.assign(item, { show_edit: true }));
      AgentList.forEach(element => {
        if (element.role === "Admin" && element.is_organization_admin === true && element.is_organization_owner === true) {
          element['show_edit'] = false;
        }
        if (this.checkIsLoggedInAgent(element.email)) {
        //  this.CommonService.loggedInAgentDetails(element);

          let fromindex = AgentList.findIndex(
            (x) => x.email === this.CommonService.getEmailForLoggedInUser()
          );
          let selectedobject = AgentList[fromindex];
          AgentList.splice(fromindex, 1);
          AgentList.splice(0, 0, selectedobject);
        }

      });
    }
    else if (data.role === 'Agent' && data.is_organization_admin === false && data.is_organization_owner === false) {
      AgentList.map((item) => Object.assign(item, { show_edit: false }));
      AgentList.forEach(element => {
        if (this.checkIsLoggedInAgent(element.email)) {
        //  this.CommonService.loggedInAgentDetails(element);
          if (element.role == "Agent") {
            element['show_edit'] = true;
          }
          let fromindex = AgentList.findIndex(
            (x) => x.email === this.CommonService.getEmailForLoggedInUser()
          );
          let selectedobject = AgentList[fromindex];
          AgentList.splice(fromindex, 1);
          AgentList.splice(0, 0, selectedobject);
        }

      });
    }

    return AgentList;

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
      this.MessageService.setSuccessMessage('Agent invitation has been sent.');
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

  // search agent 
  public search(data: string, AgentList: AgentModelTable[], AllAgentsData: AgentModelTable[]) {
    const result: AgentModelTable[] = AgentList.filter((obj: AgentModelTable) => {
      if (obj.agent_name != null) {
        return obj.agent_name.toLowerCase().includes(data.toLowerCase()) || obj.email.toLowerCase().includes(data.toLowerCase());
      }
      else if (obj.agent_name == null) {
        return obj.email.toLowerCase().includes(data.toLowerCase());
      }
      else {
        return [];
      }
    })
    if (data.length === 0) {
      return AllAgentsData;
    }
    else {
      return result;
    }

  }

  // check logged in user 
}
