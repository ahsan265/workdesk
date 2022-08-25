import { Component, OnInit, ViewChild } from '@angular/core';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { CallsOperationService } from 'src/app/workdeskServices/callInterfaceServices/callsOperation/calls-operation.service';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devicesInformation/devices-information.service';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { CallingScreenComponent } from '../calling-screen/calling-screen.component';
import {
  CallsHeaderData,
  agentOperationInformation,
  cameraOnOffData,
  hangUpData,
  maxmizeScreenData,
  miceData,
  minimizeScreenData,
  minimizeScreenVideoData,
  peerMiniCameraDetails,
  peerUserInformationData,
  screenShareData,
  secondPeerUserInformationData,
  minimizeCallControlData,
  maximizeCallControlData
} from '../callsInterfaceData';
import { MicrophoneVoiceIndicatorComponent } from '../microphone-voice-indicator/microphone-voice-indicator.component';
import { MiniCameraScreenComponent } from '../mini-camera-screen/mini-camera-screen.component';
import { OverlayService } from '../overLayService/overlay.service';

@Component({
  selector: 'app-call-console',
  templateUrl: './call-console.component.html',
  styleUrls: ['./call-console.component.scss']
})
export class CallConsoleComponent implements OnInit {
  constructor(
    private callInterfaceOverlay: OverlayService,
    private StreamingService: StreamingService,
    private MessageService: MessageService,
    private DevicesInformationService: DevicesInformationService,
    private CallSocketService: CallSocketService,
    private CommonService: CommonService,
    private CallsOperationService: CallsOperationService,
  ) { }
  minimizeCallControl = minimizeCallControlData;
  maximizeCallControl = maximizeCallControlData;
  CallsHeaderData = CallsHeaderData;
  miceData = miceData;
  cameraData = cameraOnOffData;
  screenShareData = screenShareData;
  hangUpData = hangUpData;
  peerUserInformationData = peerUserInformationData;
  secondpeerUserInformationData = secondPeerUserInformationData;
  PeerMiniCameraScreen = peerMiniCameraDetails;
  agentOperationInformationData = agentOperationInformation;
  isSplit: boolean = false;
  openDeviceSwitcher: boolean = false;
  toogle: boolean = false;
  isMinimize: boolean = false;
  isVideoMinimize: boolean = false;
  minimize = minimizeScreenData;
  maximize = maxmizeScreenData;
  minimizeVideoscreen = minimizeScreenVideoData;
  peerStream!: string;
  videoStream!: MediaStream;
  @ViewChild('videoStream') stream!: CallingScreenComponent;
  @ViewChild('miniCameraVideoStream') miniCameraVideoStream!: MiniCameraScreenComponent;
  @ViewChild('selectedMicrophone') selectedMicophone!: MicrophoneVoiceIndicatorComponent;

  ngOnInit() {
    this.StreamingService.startStream();
    this.CallSocketService.dialCall('187525222222222222222', '', false, 'chrome', this.CommonService.getEndpointsParamLocal().connectionId)
    this.CallsOperationService.addIncomingCallHandler();
    this.StreamingService.stopScreenStream.subscribe((data) => {
      this.seletecOutputForScreenShare(data);
    })
  }
  async seletecOutputForCamera(event: boolean) {
    if (!this.screenShareData.isSelected) {
      (event === true)
        ? this.PeerMiniCameraScreen.showCamera = true :
        this.PeerMiniCameraScreen.showCamera = false;
      if (event == true) {
        this.videoStream = await this.StreamingService.startVideo();
        this.stream.setStream(this.videoStream);
        this.miniCameraVideoStream.setMiniCameraSteam(this.videoStream);
      }
      else {
        this.StreamingService.stopVideo();
      }
      if (this.isSplit === true) {
        (event === true)
          ? this.peerUserInformationData.showVideo = true :
          this.peerUserInformationData.showVideo = false;
      }
      this.cameraData.isSelected = event;
      this.isVideoMinimize = event;
    }
    else {
      this.MessageService.setErrorMessage('Cannot turn on camera while sharing screen.')
    }
  }
  seletecOutputForMircrophone(event: boolean) {
    this.miceData.isSelected = event;
  }
  splitScreen(event: boolean) {
    if (event) {
      this.isSplit = event;
      this.PeerMiniCameraScreen.showSplitIncon = !event;
      if (this.cameraData.isSelected) {
        this.peerUserInformationData.showVideo = true;
      }
    }
  }
  async seletecOutputForScreenShare(event: boolean) {
    if (this.cameraData.isSelected) {
      this.seletecOutputForCamera(false);
    }
    if (event == true) {
      this.PeerMiniCameraScreen.showCamera = true;
      this.peerUserInformationData.showVideo = true;
      this.peerUserInformationData.showShareScreen = true;
      this.videoStream = await this.StreamingService.startScreenSharing();
      this.stream.setStream(this.videoStream);
      this.miniCameraVideoStream.setMiniCameraSteam(this.videoStream);
      this.screenShareData.isSelected = event;
    }
    else {
      this.PeerMiniCameraScreen.showCamera = false;
      this.peerUserInformationData.showVideo = false;
      this.peerUserInformationData.showShareScreen = false;
      this.StreamingService.stopVideo();
      this.screenShareData.isSelected = event;
    }
  }
  unSplitScreenOutput(event: boolean) {
    if (!event) {
      this.isSplit = event;
      this.PeerMiniCameraScreen.showSplitIncon = !event;
    }
    if (this.cameraData.isSelected) {
      this.peerUserInformationData.showVideo = false;

    }

  }
  seletecOutputForHangUpCall(event: boolean) {
    if (event) {
      this.callInterfaceOverlay.close();
    }
  }
  openDeviceSwitcherOutput(event: boolean) {
    if (event) {
      this.openDeviceSwitcher = true;
    }
  }
  minmizeMaxmizeScreenOutput(event: boolean) {
    this.agentOperationInformationData.isMinimize = event;
    (event && this.DevicesInformationService.getDeviceType() === true) ?
      this.minimize.height = '141px' : this.minimize.height = '99px';
    this.miniCameraOperation(event);
  }

  // for mini camera Operation 
  public miniCameraOperation(event: boolean) {
    if (event) {
      if (this.isVideoMinimize && this.DevicesInformationService.getDeviceType() === false) {
        this.minimize.width = '382px';
        this.minimize.height = '325px';
        this.isVideoMinimize = true;
        this.agentOperationInformationData.IsVideoMinimize = true;
        this.PeerMiniCameraScreen.showInitals == true;
        this.minimizeCallControl.bottom = '40px';
        this.minimizeCallControl['border-radius'] = '51px';
        this.minimizeCallControl.height = '55px'
      } else {
        this.isMinimize = true;
      }
      this.toogle = true;
    } else {
      this.minimize.width = '255px';
      this.minimize.height = '99px';
      this.minimizeCallControl.bottom = '1px';
      this.minimizeCallControl['border-radius'] = '0px';
      this.minimizeCallControl.height = '50px'
      this.agentOperationInformationData.IsVideoMinimize = false;
      this.PeerMiniCameraScreen.showInitals == false;
      this.toogle = false;
      this.isMinimize = false;
    }
  }
}
