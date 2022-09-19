import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { dataTableSettings } from 'src/app/agents/agentsData';
import {
  CallControlModel,
  agentOperationInformationModel,
  inputOuputdevices
} from 'src/app/models/callInterfaceModel';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devicesInformation/devices-information.service';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';
import {
  inputDevices,
  maximizeCallControlData,
  minimizeCallControlData,
  outputDevice,
  videoMinimizeControlData
} from '../callsInterfaceData';
import { MicrophoneVoiceIndicatorComponent } from '../microphone-voice-indicator/microphone-voice-indicator.component';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit {
  @Input() minimizeCallControl!: any;
  @Input() maximizeCallControl!: any;

  videoMinimizeControlData = videoMinimizeControlData;
  inputDeviceData = inputDevices;
  outputDeviceData = outputDevice;
  @Input() miceData!: CallControlModel;
  @Input() cameraData!: CallControlModel;
  @Input() screenShareData!: CallControlModel;
  @Input() hangUpData!: CallControlModel;
  @Input() time!: string;
  @Input() openDeviceSwitcher: boolean = false;
  @Input() agentOperationInformationData!: agentOperationInformationModel;
  @Input() isMinimize!: boolean;

  @Output() seletecOutputForMicrophone = new EventEmitter();
  @Output() seletecOutputForCamera = new EventEmitter();
  @Output() seletecOutputForScreenShare = new EventEmitter();
  @Output() seletecOutputForHangUpCall = new EventEmitter();
  @Output() openDeviceSwitcherOutput = new EventEmitter();

  constructor(
    private DevicesInformationService: DevicesInformationService,
    private StreamingService: StreamingService,
    private AgentUserInformation: AgentUserInformation
  ) { }

  async ngOnInit(): Promise<void> {
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      await this.deviceData()
      this.markLastUsedDevices();
    })
   await this.deviceData();
    this.markLastUsedDevices()
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
      this.inputDeviceData.devices.forEach(async (data) => {
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

  setVideoMinimize() {
    console.log('hello');
    return videoMinimizeControlData;
  }
  async deviceData() {
    const devices = await this.DevicesInformationService.getAllDevice();
    this.inputDeviceData.devices = devices.audioInputDevices.map((data) => ({
      id: data.deviceId,
      groupId: data.groupId,
      name: data.label,
      deviceType: data.kind,
      isSelected: false,
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
      isSelected: false,
      selectedbackgroundColor: '#243247',
      hoverColor: '',
      selectedIcon: '../../../assets/images/callInterface/green_check_icon.svg',
      voiceLevels: 0
    }));
  }
  // mark last Used Devices 
  private markLastUsedDevices()
  {
    const userInformation = this.AgentUserInformation.getCallInformation();
    // for last used microphone
    (userInformation.last_used_microphone === undefined) ?
      this.inputDeviceData.devices[0].isSelected = true :
      this.inputDeviceData.devices.find(data => {
        if (data.id === userInformation.last_used_microphone.id) {
          data.isSelected = true;
        }
      });
    // for last used speaker
    (userInformation.last_used_speaker === undefined) ?
      this.outputDeviceData.devices[0].isSelected = true :
      this.outputDeviceData.devices.filter(data => {
        if (data.id === userInformation.last_used_speaker.id) {
          data.isSelected = true;
        }
      })
  }

}
