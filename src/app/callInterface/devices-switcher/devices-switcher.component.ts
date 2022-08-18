import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { devcieInformationModel, groupDeicesInformation, inputOuputdevices } from 'src/app/models/callInterfaceModel';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devices/devices-information.service';
import { inputDevices, outputDevice } from '../callsInterfaceData';

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

  async ngOnInit() {
 

  }
  getInputOutputDeviceInformation(event: inputOuputdevices) {
    this.selectInputOutputDeviceInformation.emit(event)
  }
}
