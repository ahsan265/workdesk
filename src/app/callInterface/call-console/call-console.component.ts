import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { CallsOperationService } from 'src/app/workdeskServices/callInterfaceServices/callsOperation/calls-operation.service';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devicesInformation/devices-information.service';
import { PeerConnectionService } from 'src/app/workdeskServices/callInterfaceServices/peerConnection/peer-connection.service';
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
  maximizeCallControlData,
  maxmizeScreenData,
  miceData,
  minimizeCallControlData,
  minimizeScreenData,
  minimizeScreenVideoData,
  peerMiniCameraDetails,
  peerNormalImage,
  peerUserInformationData,
  screenShareData,
  secondPeerUserInformationData
} from '../callsInterfaceData';
import { MicrophoneVoiceIndicatorComponent } from '../microphone-voice-indicator/microphone-voice-indicator.component';
import { MiniCameraScreenComponent } from '../mini-camera-screen/mini-camera-screen.component';
import { CloseDialogOverlayRef } from '../overLayService/closeDialogService';
import { OverlayService } from '../overLayService/overlay.service';

@Component({
  selector: 'app-call-console',
  templateUrl: './call-console.component.html',
  styleUrls: ['./call-console.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CallConsoleComponent implements OnInit, OnDestroy {
  constructor(
    private StreamingService: StreamingService,
    private MessageService: MessageService,
    private DevicesInformationService: DevicesInformationService,
    private CallSocketService: CallSocketService,
    private CommonService: CommonService,
    private CallsOperationService: CallsOperationService,
    private PeerConnectionService: PeerConnectionService,
    private AgentUserInformation: AgentUserInformation
  ) {}
  ngOnDestroy(): void {
    this.minmizeMaxmizeScreenOutput(false);
  }
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
  isRemoteEnabled: boolean = false;
  minimize = minimizeScreenData;
  maximize = maxmizeScreenData;
  minimizeVideoscreen = minimizeScreenVideoData;
  peerStream!: string;
  videoStream!: MediaStream;
  callTimer: string = '00m:00s';
  @ViewChild('videoStream') stream!: CallingScreenComponent;
  @ViewChild('miniCameraVideoStream')
  miniCameraVideoStream!: MiniCameraScreenComponent;
  @ViewChild('selectedMicrophone')
  selectedMicophone!: MicrophoneVoiceIndicatorComponent;
  @ViewChild('miniCameraScreen')
  miniCameraScreen!: ElementRef<HTMLMediaElement>;

  async ngOnInit() {
    await this.StreamingService.loadAudioandVideoResouce();
    this.StreamingService.getLocalStream.subscribe((stream) => {
      this.miniCameraVideoStream.setMiniCameraSteam(stream);
      this.stream.setStream(stream);
    });
    const user = this.AgentUserInformation.getCallInformation();
    if (user.is_refreshed === true) {
      this.CallSocketService.dialCall(
        'a651c27a-91e5-4749-a301-0c9ae6eab6b3',
        user.user_information.user_id,
        true,
        this.DevicesInformationService.getBrowserName(),
        this.CommonService.getEndpointsParamLocal().connectionId
      );
      this.secondpeerUserInformationData.firstName =
        user.peer_information.data.first_name;
      this.secondpeerUserInformationData.lastName =
        user.peer_information.data.last_name;
      this.PeerMiniCameraScreen.showCamera =
        user.user_information.data.is_camera_on;
      this.peerUserInformationData.showVideo =
        user.user_information.data.is_camera_on;
      this.peerUserInformationData.showShareScreen =
        user.user_information.is_shared_screen;
      this.cameraData.isSelected = user.user_information.data.is_camera_on;
      this.isVideoMinimize = user.user_information.data.is_camera_on;
      // this.miceData.isSelected = user.user_information.data.is_microphone_on;
    } else {
      this.CallSocketService.dialCall(
        'a651c27a-91e5-4749-a301-0c9ae6eab6b3',
        '',
        false,
        this.DevicesInformationService.getBrowserName(),
        this.CommonService.getEndpointsParamLocal().connectionId
      );
    }

    this.CallsOperationService.addIncomingCallHandler();
    this.StreamingService.stopScreenStream.subscribe((data) => {
      this.seletecOutputForScreenShare(data);
    });
    this.PeerConnectionService.remoteVideoSubject.subscribe((stream) => {
      this.stream.setRemoteStream(stream);
    });

    // for update calling screen data on evey thange
    this.CallsOperationService.sendPeerInformation.subscribe((peerData) => {
      this.secondpeerUserInformationData.firstName = peerData.firstName;
      this.secondpeerUserInformationData.lastName = peerData.lastName;
      this.secondpeerUserInformationData.showShareScreen =
        peerData.isScreenShareOn;
      this.secondpeerUserInformationData.showImage = true;
      this.secondpeerUserInformationData.showInitials = false;
      this.secondpeerUserInformationData.showLoaderAnimation = false;
      // for header
      CallsHeaderData.name = peerData.firstName + ' ' + peerData.lastName;
      // CallsHeaderData.agentImage = peerData.peerImage;
    });
    // showing timer
    const startTime = new Date(Date.now());
    this.CallsOperationService.startTimer.subscribe((isStarted) => {
      if (isStarted) {
        setInterval(() => {
          user.is_refreshed === true
            ? (this.callTimer = this.AgentUserInformation.CallDuration(
                user.call_duration
              ))
            : (this.callTimer =
                this.AgentUserInformation.callJoiningTime(startTime));
        }, 1000);
      }
    });
  }
  public async seletecOutputForCamera(event: boolean) {
    if (!this.screenShareData.isSelected) {
      event === true
        ? (this.PeerMiniCameraScreen.showCamera = true)
        : (this.PeerMiniCameraScreen.showCamera = false);
      if (event == true) {
        this.videoStream = await this.StreamingService.startVideo(
          this.CallsOperationService.peerUserId
        );
        this.stream.setStream(this.videoStream);
        this.miniCameraVideoStream.setMiniCameraSteam(this.videoStream);
      } else {
        this.StreamingService.stopVideo();
      }
      if (this.isSplit === true) {
        event === true
          ? (this.peerUserInformationData.showVideo = true)
          : (this.peerUserInformationData.showVideo = false);
      }
      this.cameraData.isSelected = event;
      this.isVideoMinimize = event;

      if (this.agentOperationInformationData.isMinimize === true) {
        this.miniCameraOperation(event);
      }
    } else {
      this.MessageService.setErrorMessage(
        'Cannot turn on camera while sharing screen.'
      );
    }
  }
  seletecOutputForMircrophone(event: boolean) {
    this.miceData.isSelected = event;
    event
      ? this.AgentUserInformation.setMicrophoneStatus(true)
      : this.AgentUserInformation.setMicrophoneStatus(false);
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
      this.videoStream = await this.StreamingService.startScreenSharing(
        this.CallsOperationService.peerUserId
      );
      this.stream.setStream(this.videoStream);
      this.miniCameraVideoStream.setMiniCameraSteam(this.videoStream);
      this.screenShareData.isSelected = event;
    } else {
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
      this.StreamingService.hangUpCall();
    }
  }
  openDeviceSwitcherOutput(event: boolean) {
    if (event) {
      this.openDeviceSwitcher = true;
    }
  }
  minmizeMaxmizeScreenOutput(event: boolean) {
    this.agentOperationInformationData.isMinimize = event;
    event && this.DevicesInformationService.getDeviceType() === true
      ? (this.minimize.height = '141px')
      : (this.minimize.height = '146px');
    this.miniCameraOperation(event);
    this.AgentUserInformation.setIsMinimize(event);
  }

  // for mini camera Operation
  public miniCameraOperation(event: boolean) {
    if (event) {
      if (
        this.isVideoMinimize &&
        this.DevicesInformationService.getDeviceType() === false
      ) {
        this.minimize.width = '382px';
        this.minimize.height = '325px';
        this.agentOperationInformationData.IsVideoMinimize = true;
        this.PeerMiniCameraScreen.showInitals == true;
        this.minimizeCallControl.bottom = '50px';
        this.minimizeCallControl['border-radius'] = '51px';
        this.minimizeCallControl.height = '55px';
        this.isMinimize = false;
      } else {
        this.isMinimize = true;
      }
      this.toogle = true;
    } else {
      if (this.agentOperationInformationData.isMinimize === false) {
        this.minimize.width = '255px';
        this.minimize.height = '99px';
        this.minimizeCallControl.bottom = '70px';
        this.minimizeCallControl['border-radius'] = '0px';
        this.minimizeCallControl.height = '50px';
        this.agentOperationInformationData.IsVideoMinimize = false;
        this.PeerMiniCameraScreen.showInitals == false;
        this.toogle = false;
        this.isMinimize = false;
      }
    }
  }
}
