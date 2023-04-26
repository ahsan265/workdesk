import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { interval } from 'rxjs';
import { TableSettingsModel, tableSettingsDataModel } from 'src/app/models/agent';
import { IncomingCallModelTable } from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { incomingTableSetting } from '../incomingData';

@Component({
  selector: 'app-incoming-table',
  templateUrl: './icoming-table.component.html',
  styleUrls: ['./icoming-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class IcomingTableComponent {
  @Input() tableSettings = incomingTableSetting;
  @Input() incomingCallData: IncomingCallModelTable[] = [];
  @Output() callUuid = new EventEmitter<string>();

  constructor(private ChangeDetectorRef: ChangeDetectorRef,
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService) {
    interval(1000).subscribe(() => {
      this.ChangeDetectorRef.detectChanges();
    });
    this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'incoming').then((data: tableSettingsDataModel[]) => {
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, incomingTableSetting);
      }
      else {
        this.tableSettings = incomingTableSetting;
      }
    })
  }

  ngOnInit(): void {
  }
  getArray(val: number) {
    return Array(val);
  }
  getCallId(event: any) {
    this.callUuid.emit(event);
  }

  // get ellapsed time
  getTimer(entry: string) {
    this.ChangeDetectorRef.markForCheck();
    return this.CommonService.getElapsedTime(entry);
  }
  showEditField(name: string) {
    this.tableSettings.forEach(data => {
      if (data.header === name) {
        data.showEditField = true;
      }
      else {
        data.showEditField = false;
      }
    })
  }
  // upate field 
  async updatedField(event: any) {
    if (event.value !== '') {
      this.tableSettings.forEach(data => {
        data.showEditField = false;
      })
      await this.GigaaaApiService.tableCustomization(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, event.headerInformation.index, event.value, 'incoming')
      const data = await this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'incoming');
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
