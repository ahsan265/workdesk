import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  devcieInformationModel,
  inputOuputdevices
} from 'src/app/models/callInterfaceModel';

@Component({
  selector: 'app-devices-switcher',
  templateUrl: './devices-switcher.component.html',
  styleUrls: ['./devices-switcher.component.scss']
})
export class DevicesSwitcherComponent implements OnInit {
  @Input() inputDevicesData!: devcieInformationModel;
  @Input() outputDevicesData!: devcieInformationModel;
  @Output() selectInputOutputDeviceInformation = new EventEmitter();

  constructor() { }

  async ngOnInit() { }
  getInputOutputDeviceInformation(event: inputOuputdevices) {
    this.selectInputOutputDeviceInformation.emit(event);
  }
}
