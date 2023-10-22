import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { commonFunctionService } from '@gigaaa/gigaaa-components/lib/services/common-function.service';
import { interval } from 'rxjs';
import {
  TableSettingsModel,
  tableSettingsDataModel
} from 'src/app/models/agent';
import { OngoingCallModelTable, tableHeading } from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { ongoingTableSetting } from '../ongoingData';
import { headerDataModel } from 'src/app/models/user';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

@Component({
  selector: 'app-ongoing-table',
  templateUrl: './ongoing-table.component.html',
  styleUrls: ['./ongoing-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OngoingTableComponent implements OnInit {
  @Input() tableSettings = ongoingTableSetting;
  @Input() ongoingCallData: OngoingCallModelTable[] = [];
  @Output() callUuid = new EventEmitter<string>();

  constructor(
    private SharedServices: SharedServices,
    private ChangeDetectorRef: ChangeDetectorRef,
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService
  ) {
    interval(1000).subscribe(() => {
      this.ChangeDetectorRef.detectChanges();
    });
    this.GigaaaApiService.tableCustomizationList(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      this.CommonService.getEndpointsParamLocal().project,
      'ongoing'
    ).then((data: tableSettingsDataModel[]) => {
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(
          data,
          ongoingTableSetting
        );
        this.tableSettings.forEach((element) => {
          element.canEdit =
            this.CommonService.getIsAdminOrAgent() &&
            this.CommonService.getLoggedInAgentData().is_organization_owner;
        });
      } else {
        this.tableSettings = ongoingTableSetting;
        this.tableSettings.forEach((element) => {
          element.canEdit =
            this.CommonService.getIsAdminOrAgent() &&
            this.CommonService.getLoggedInAgentData().is_organization_owner;
        });
      }
    });
    this.SharedServices.LoadcommonEpsubject.subscribe((data) => {
      if (data === 1) {
        this.tableSettings.forEach((element) => {
          element.canEdit =
            this.CommonService.getIsAdminOrAgent() &&
            this.CommonService.getLoggedInAgentData().is_organization_owner;
        });
      }
    });
  }

  ngOnInit(): void {}
  getArray(val: number) {
    return Array(val);
  }
  getCallId(event: string) {
    if (event) {
      this.callUuid.emit(event);
    }
  }
  // get ellapsed time
  getTimer(entry: string) {
    this.ChangeDetectorRef.markForCheck();
    return this.CommonService.onGoingTimer(entry, 'h');
  }

  showEditField(index: number) {
    if (
      this.CommonService.getIsAdminOrAgent() &&
      this.CommonService.getLoggedInAgentData().is_organization_owner
    ) {
      this.tableSettings.forEach((data) => {
        if (data.index === index) {
          data.showEditField = true;
        } else {
          data.showEditField = false;
        }
      });
    }
  }
  // upate field
  async updatedField(event: headerDataModel) {
    if (event.value !== '') {
      this.tableSettings.forEach((data) => {
        data.showEditField = false;
      });
      await this.GigaaaApiService.tableCustomization(
        this.CommonService.getEndpointsParamLocal().token,
        this.CommonService.getEndpointsParamLocal().organization,
        this.CommonService.getEndpointsParamLocal().project,
        event.headerInformation.index,
        event.value,
        'ongoing'
      );
      const data = await this.GigaaaApiService.tableCustomizationList(
        this.CommonService.getEndpointsParamLocal().token,
        this.CommonService.getEndpointsParamLocal().organization,
        this.CommonService.getEndpointsParamLocal().project,
        'ongoing'
      );
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(
          data,
          this.tableSettings
        );
      }
    } else {
      this.tableSettings.forEach((data) => {
        data.showEditField = false;
      });
    }
  }
}
