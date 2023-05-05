import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { TableSettingsModel, tableSettingsDataModel } from 'src/app/models/agent';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { agentTableSetting } from '../agentsData';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';
import { headerDataModel } from 'src/app/models/user';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';

@Component({
  selector: 'app-agent-table',
  templateUrl: './agent-table.component.html',
  styleUrls: ['./agent-table.component.scss']
})
export class AgentTableComponent {
  @Input() tableSettings!: TableSettingsModel[];
  @Input() agentData: any[] = [];
  @Output() agentSetting = new EventEmitter<string[]>();
  showField: boolean = false;
  constructor(private AgentSocketService: AgentSocketService, private GigaaaApiService: GigaaaApiService, private CommonService: CommonService) {
    this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'Agent').then((data: tableSettingsDataModel[]) => {
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, agentTableSetting);
        agentTableSetting.forEach(element => {
          element.canEdit = this.CommonService.getIsAdminOrAgent() && this.CommonService.getLoggedInAgentData().is_organization_owner;
        })
      }
      else {
        this.tableSettings = agentTableSetting;
        agentTableSetting.forEach(element => {
          element.canEdit = this.CommonService.getIsAdminOrAgent() && this.CommonService.getLoggedInAgentData().is_organization_owner;
        })
      }
    })
    this.AgentSocketService.loggedAgentData.subscribe(data => {
      if (data) {
        agentTableSetting.forEach(element => {
          element.canEdit = this.CommonService.getIsAdminOrAgent() && this.CommonService.getLoggedInAgentData().is_organization_owner;
        })
      }
    })

  }

  ngOnInit(): void {
  }
  getArray(val: number) {
    return Array(val);
  }
  getSettings(event: string[]) {
    if (event) {
      this.agentSetting.emit(event)
    }

  }

  showEditField(id: number) {
    if (this.CommonService.getIsAdminOrAgent() && this.CommonService.getLoggedInAgentData().is_organization_owner) {
      agentTableSetting.forEach(data => {
        if (data.index === id) {
          data.showEditField = true;
        }
        else {
          data.showEditField = false;
        }
      })
    }
  }
  async updatedField(event: headerDataModel) {
    if (event.value !== '') {
      this.tableSettings.forEach(data => {
        data.showEditField = false;
      })

      await this.GigaaaApiService.tableCustomization(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, event.headerInformation.index, event.value, 'Agent')
      const data = await this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'Agent');
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, this.tableSettings);
      }
    }
    else {
      this.tableSettings.forEach(data => {
        data.showEditField = false;
      })
      // await this.GigaaaApiService.tableCustomization(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, event.headerInformation.index, event.headerInformation.defaultValue, 'Agent')
      // const data = await this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'Agent');
      // this.tableSettings = this.CommonService.updateColumnTable(data, this.tableSettings);
    }
  }


}
