import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CallControlModel,
  agentOperationInformationModel,
  inputOuputdevices
} from 'src/app/models/callInterfaceModel';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devices/devices-information.service';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';
import {
  inputDevices,
  maximizeCallControlData,
  minimizeCallControlData,
  outputDevice,
  videoMinimizeControlData
} from '../callsInterfaceData';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit {
  minimizeCallControl = minimizeCallControlData;
  maximizeCallControl = maximizeCallControlData;
  videoMinimizeControlData = videoMinimizeControlData;
  inputDeviceData = inputDevices;
  outputDeviceData = outputDevice;
  @Input() miceData!: CallControlModel;
  @Input() cameraData!: CallControlModel;
  @Input() screenShareData!: CallControlModel;
  @Input() hangUpData!: CallControlModel;
  @Input() timeText!: string;
  @Input() openDeviceSwitcher: boolean = false;
  @Input() agentOperationInformationData!: agentOperationInformationModel;

  @Output() seletecOutputForMicrophone = new EventEmitter();
  @Output() seletecOutputForCamera = new EventEmitter();
  @Output() seletecOutputForScreenShare = new EventEmitter();
  @Output() seletecOutputForHangUpCall = new EventEmitter();
  @Output() openDeviceSwitcherOutput = new EventEmitter();

  constructor(
    private DevicesInformationService: DevicesInformationService,
    private StreamingService: StreamingService
  ) {}

  async ngOnInit(): Promise<void> {
    const devices = await this.DevicesInformationService.getAllDevice();
    this.inputDeviceData.devices = devices.audioInputDevices.map((data) => ({
      id: data.deviceId,
      groupId: data.groupId,
      name: data.label,
      deviceType: data.kind,
      isSelected: true,
      selectedbackgroundColor: '#243247',
      hoverColor: '',
      selectedIcon: '../../../assets/images/callInterface/green_check_icon.svg',
      voiceLevels: 0
    }));
    // output device

    this.outputDeviceData.devices = devices.audioOutputDevice.map((data) => ({
      id: data.deviceId,
      groupId: data.groupId,
      name: data.label,
      deviceType: data.kind,
      isSelected: true,
      selectedbackgroundColor: '#243247',
      hoverColor: '',
      selectedIcon: '../../../assets/images/callInterface/green_check_icon.svg',
      voiceLevels: 0
    }));
  }
  // on of microphone
  onOffMicrophone(event: boolean) {
    event === false
      ? this.StreamingService.muteAudio()
      : this.StreamingService.unmunteAudio();
    this.seletecOutputForMicrophone.emit(event);
  }
  // on off camera
  onOffCamera(event: boolean) {
    // (event === true) ? this.minimizeCallControl.bottom = '20px' : this.minimizeCallControl.bottom = "20px";
    this.seletecOutputForCamera.emit(event);
  }
  // on off screen share
  onOffScreenShare(event: boolean) {
    this.seletecOutputForScreenShare.emit(event);
  }
  // on Off hang up call
  hangUpcall(event: boolean) {
    this.seletecOutputForHangUpCall.emit(event);
  }
  // open and close device switcher
  openDeviceSwitcherPopup(event: boolean) {
    this.openDeviceSwitcherOutput.emit(event);
    event
      ? (this.openDeviceSwitcher = true)
      : (this.openDeviceSwitcher = false);
  }
  // get selected Device Information
  selectInputOutputDeviceInformation(event: inputOuputdevices) {
    if (event.deviceType === 'audioinput') {
      this.inputDeviceData.devices.forEach((data) => {
        data.id === event.id
          ? (data.isSelected = true)
          : (data.isSelected = false);
      });
    } else if (event.deviceType === 'audiooutput') {
      this.outputDeviceData.devices.forEach((data) => {
        data.id === event.id
          ? (data.isSelected = true)
          : (data.isSelected = false);
      });
    }
  }
}
