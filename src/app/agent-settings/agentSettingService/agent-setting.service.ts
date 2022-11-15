import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AgentSettings } from 'src/app/models/agentSettingsModel';
import { AgentLanguages, AgentList } from 'src/app/models/agentSocketModel';
import { MultiSelect } from 'src/app/models/multiSelect';
import { OneSelect } from 'src/app/models/oneSelect';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';

@Injectable({
  providedIn: 'root'
})
export class AgentSettingService {
  showAdminStatusAlert: boolean = false;
  constructor(
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private MessageService: MessageService,
    private Router: Router
  ) { }

  // get agentS Updated Data ()
  public async updateAgentSettings(
    agentsetting: AgentSettings,
    agentUuid: string
  ) {
    try {
      await this.GigaaaApiService.updateAgentSettings(
        this.CommonService.getEndpointsParamLocal().token,
        this.CommonService.getEndpointsParamLocal().organization,
        this.CommonService.getEndpointsParamLocal().project,
        agentUuid,
        agentsetting
      );
      this.MessageService.setSuccessMessage('All Changes Saved.');
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
  }
  public async getAgentData(agentUuid: string): Promise<AgentList> {
    const agent: AgentList = await this.GigaaaApiService.getSelectedAgentData(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      this.CommonService.getEndpointsParamLocal().project,
      agentUuid
    );
    return agent;
  }
  public getLanguagesMaped(Language: AgentLanguages[]) {
    const lang: OneSelect[] = Language.map((data: AgentLanguages) => ({
      name: data.name,
      id: data.id,
      selected: true
    }));
    const agentLanguages: MultiSelect = {
      showSearchBar: false,
      title: 'Language',
      showSelectAll: false,
      data: lang
    };
    return agentLanguages;
  }

  public isAdmin(role: string) {
    return role === 'Admin' ? true : false;
  }
  public checkAdminOrganizationOrNomral(
    isOrganizationAdmin: boolean,
    role: string
  ) {
    if (isOrganizationAdmin === true && role === 'Admin') {
      return 'Organization admins cannot turn off administrative rights.';
    } else if (isOrganizationAdmin === false && role === 'Admin') {
      return '';
    } else if (isOrganizationAdmin === false && role === 'Agent' && this.CommonService.getLoggedInAgentData().role !== 'Admin') {
      return 'Agents cannot turn on administrative rights.';
    }
    else {
      return '';
    }
  }
  // show pending agent message
  public checkAgentStatusIsPendingLanguage(isPending: boolean) {
    return isPending === false
      ? 'Language(s) cannot be changed in pending status.'
      : '';
  }
  // show Pending agent for Adming rights
  public checkAgentStatusIsPendingAdminRights(isPending: boolean) {
    return isPending === false
      ? 'Administrative rights cannot be changed in pending status.'
      : '';
  }

  public agentUserName(agentData: AgentList): any {
    return agentData.invited === true
      ? 'Not joined yet'
      : { first_name: agentData.first_name, last_name: agentData.last_name };
  }
  public checkAgentIsInvited(agentData: AgentList): boolean {
    return agentData.invited === true ? true : false;
  }
  public async deleteAgent(agentUuid: string, toastMessage: string) {
    await this.GigaaaApiService.deleteagent(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      this.CommonService.getEndpointsParamLocal().project,
      agentUuid
    );
    this.MessageService.setSuccessMessage(toastMessage);
    this.Router.navigate(['agents']);
  }
  public async resendInvitation(agentUuid: string) {
    await this.GigaaaApiService.resendInvitation(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      this.CommonService.getEndpointsParamLocal().project,
      agentUuid
    );
    this.MessageService.setSuccessMessage('Agent Invitation has been resent.');
  }
  public updateAgentImage() { }
  public updateLoggedInUserImage() { }

  public async UpdatePassword(data: any, id: number) {
    await this.GigaaaApiService.updatePassword(
      this.CommonService.getEndpointsParamLocal().token,
      data,
      id
    );
    this.MessageService.setSuccessMessage('Password Updated Successfully.');
  }
  // set All selected Language for Recieving requestion for all language users

  public async setAllLanguageEnabled(uuid: string, data: any) {
    try {
      await this.GigaaaApiService.setAllLanguageEnabled(
        this.CommonService.getEndpointsParamLocal().token,
        uuid,
        this.CommonService.getEndpointsParamLocal().organization,
        this.CommonService.getEndpointsParamLocal().project,
        data
      );
      data.all_languages === true
        ? this.MessageService.setSuccessMessage(
          'All project languages are assigned to you.'
        )
        : '';
    } catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error);
    }
  }
}
