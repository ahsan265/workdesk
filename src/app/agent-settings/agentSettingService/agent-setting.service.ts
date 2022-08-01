import { Injectable } from '@angular/core';
import { CommonEndpoints } from 'src/app/commonEndpoints/commonEndpoint';
import { AgentSettings } from 'src/app/models/agentSettingsModel';
import { AgentLanguages, AgentList } from 'src/app/models/agentSocketModel';
import { MultiSelect } from 'src/app/models/multiSelect';
import { OneSelect } from 'src/app/models/oneSelect';
import { User } from 'src/app/models/user';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AgentSettingService {

  constructor(private GigaaaApiService: GigaaaApiService, private CommonEndpoints: CommonEndpoints) { }

  // get agentS Updated Data ()
  public updateAgentSettings(agentsetting: AgentSettings, agentUuid: string) {
    this.GigaaaApiService.updateAgentSettings(this.CommonEndpoints.getEpsParamLocal().token, this.CommonEndpoints.getEpsParamLocal().organization,
      this.CommonEndpoints.getEpsParamLocal().project, agentUuid, agentsetting).catch((err: any) => {
        console.log(err)
      })
  }
  public async sentAgentData(agentUuid: string): Promise<AgentList> {
    const agent: AgentList = await this.GigaaaApiService.getSelectedAgentData(this.CommonEndpoints.getEpsParamLocal().token, this.CommonEndpoints.getEpsParamLocal().organization,
      this.CommonEndpoints.getEpsParamLocal().project, agentUuid);
    return agent
  }
  public getLanguagesMaped(Language: AgentLanguages[]) {
    const lang: OneSelect[] = Language.map((data: AgentLanguages) => ({
      name: data.name,
      id: data.id,
      selected: true,
    }))
    const agentLanguages: MultiSelect = { showSearchBar: false, title: "Language", showSelectAll: false, data: lang };
    return agentLanguages
  }
  // check is user admin or agent 
  public checkIsLoggedInAgent(agentEmail: string) {
    const userInfo: User = JSON.parse(localStorage.getItem('gigaaa-user') || '{}');
    return (userInfo.email === agentEmail) ? true : false;
  }
  public isAdmin(role: string) {
    return (role === 'Admin') ? false : true;
  }
}
