import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { paginationModel } from '@gigaaa/gigaaa-components/lib/models/pagination';
import { TableSettingsModel, tableSettingsDataModel } from 'src/app/models/agent';
import { AnsweredCallModelTable, tableHeading } from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { answeredTablaSetting } from '../../missed/missedData';
import { headerDataModel } from 'src/app/models/user';

@Component({
  selector: 'app-answered-table',
  templateUrl: './answered-table.component.html',
  styleUrls: ['./answered-table.component.scss']
})
export class AnsweredTableComponent {
  showDropdown: boolean = false
  @Input() tableSettings = answeredTablaSetting;
  @Input() answeredCallData: AnsweredCallModelTable[] = [];
  @Input() pagination: paginationModel = { currentPage: 1, itemsPerPage: 10, totalItems: 50, totolPages: 12 };
  @Output() callUuid = new EventEmitter<string>();
  @Output() pageNumber = new EventEmitter<number>();
  @Output() itemPerPage = new EventEmitter<number>();
  @ViewChild('dropdown') dropdown: any = HTMLElement;
  tableSizes = [{ value: 5, selected: false }, { value: 10, selected: true }, { value: 15, selected: false }, { value: 20, selected: false }];
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.dropdown?.nativeElement.contains(event?.target)) {
      this.showDropdown = false;
    }
  }
  constructor(private GigaaaApiService: GigaaaApiService, private CommonService: CommonService) {
    this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'answered').then((data: tableSettingsDataModel[]) => {
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, answeredTablaSetting);
        this.tableSettings.forEach(element => {
          element.canEdit = this.CommonService.getIsAdminOrAgent();
        })
      }
      else {
        this.tableSettings = answeredTablaSetting;
        this.tableSettings.forEach(element => {
          element.canEdit = this.CommonService.getIsAdminOrAgent();
        })
      }
    })
  }

  ngOnInit(): void {
  }
  onOpenDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  getArray(val: number) {
    return Array(val);
  }
  getCallId(event: string) {
    if (event) {
      this.callUuid.emit(event);
    }
  }
  onTableDataChange(event: any) {
    this.pagination.currentPage = event;
    this.pageNumber.emit(event);

  }
  onTableSizeChange(event: any) {
    this.tableSizes.forEach(data => {
      (data.value === event.value) ?
        data.selected = true : data.selected = false;
    })
    this.pagination.itemsPerPage = event.value;
    this.itemPerPage.emit(event.value);
  }

  showEditField(index: number) {
    this.tableSettings.forEach(data => {
      if (data.index === index) {
        data.showEditField = true;
      }
      else {
        data.showEditField = false;
      }
    })
  }
  // upate field 
  async updatedField(event: headerDataModel) {
    if (event.value !== '') {
      this.tableSettings.forEach(data => {
        data.showEditField = false;
      })
      await this.GigaaaApiService.tableCustomization(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, event.headerInformation.index, event.value, 'answered')
      const data = await this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'answered');
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, this.tableSettings);
      }
    }
    else {
      this.tableSettings.forEach(data => {
        data.showEditField = false;
      })
      await this.GigaaaApiService.tableCustomization(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, event.headerInformation.index, event.headerInformation.defaultValue, 'answered')
      const data = await this.GigaaaApiService.tableCustomizationList(this.CommonService.getEndpointsParamLocal().token, this.CommonService.getEndpointsParamLocal().organization, this.CommonService.getEndpointsParamLocal().project, 'answered');
      if (data.length !== 0) {
        this.tableSettings = this.CommonService.updateColumnTable(data, this.tableSettings);
      }
    }
  }
}
