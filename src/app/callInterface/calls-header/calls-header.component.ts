import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { agentOperationInformationModel, CallsHeaderModel } from 'src/app/models/callInterfaceModel';
import { maximizeHeaderData, minimizeHeaderData } from '../callsInterfaceData';

@Component({
  selector: 'app-calls-header',
  templateUrl: './calls-header.component.html',
  styleUrls: ['./calls-header.component.scss']
})
export class CallsHeaderComponent implements OnInit {
  minimizeData = minimizeHeaderData
  maximizeData = maximizeHeaderData;
  @Input() agentOperationInformation!: agentOperationInformationModel
  @Input() callsHeaderData!: CallsHeaderModel
  @Input() isCameraOn!:boolean;
  @Output() minmizeMaxmizeScreenOutput = new EventEmitter();

  constructor() { }
  ngOnInit(): void {
  }
  minmizeMaxmizeScreen(event: boolean) {
    this.minmizeMaxmizeScreenOutput.emit(event)
  }
}
