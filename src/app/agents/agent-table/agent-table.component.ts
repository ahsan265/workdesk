import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { TableSettingsModel, tableSettingsDataModel } from 'src/app/models/agent';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';

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
  // @ViewChild('textField') textField: any = HTMLElement;
  // @HostListener('document:click', ['$event'])
  // clickout(event: any) {
  //   if (this.textField?.nativeElement.contains(event?.target)) {
  //     this.tableSettings.forEach(data => {
  //       data.showEditField = false;
  //     })
  //   }
  // }
  constructor(private GigaaaApiService: GigaaaApiService, private CommonService: CommonService) {
    this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'Agent').then((data: tableSettingsDataModel[]) => {
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, this.tableSettings);
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

  showEditField(name: string) {
    // this.showField = !this.showField;
    this.tableSettings.forEach(data => {
      if (data.header === name) {
        data.showEditField = true;
      }
      else {
        data.showEditField = false;
      }
    })

  }
  async updatedField(event: any) {

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
    }
  }


}
