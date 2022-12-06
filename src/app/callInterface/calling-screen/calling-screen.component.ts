import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { loaderAnimation } from 'src/app/animations/loaderAnimation';
import { peerVoiceIndicator } from 'src/app/animations/peerinIdcators';
import {
  PeerInformationModel,
  agentOperationInformationModel,
  inputOuputdevices
} from 'src/app/models/callInterfaceModel';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { CallsOperationService } from 'src/app/workdeskServices/callInterfaceServices/callsOperation/calls-operation.service';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devicesInformation/devices-information.service';
import {
  peerNormalCallConnectedData,
  peerNormalImage,
  peerNormalImageNormal,
  peerVideoCallConnectedData
} from '../callsInterfaceData';
import { peerIndicatorData } from './peerIndicatorData';

@Component({
  selector: 'app-calling-screen',
  templateUrl: './calling-screen.component.html',
  styleUrls: ['./calling-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [peerVoiceIndicator, loaderAnimation]
})
export class CallingScreenComponent implements OnInit {
  peerImageNormal = peerNormalImageNormal;
  peerImageData = peerNormalImage;
  miniMizeVideoData = peerVideoCallConnectedData;
  maxiMizeNormaData = peerNormalCallConnectedData;
  peerInidcatorData = peerIndicatorData;
  @Input() peerInformationdata!: PeerInformationModel;
  @Input() secondPeerInformationdata!: PeerInformationModel;
  @Input() peerStream!: string;
  @Input() secondPeerStream!: string;
  @Input() isSplit: boolean = false;
  isRemoteEnabled: boolean = false;
  @Input() agentOperationInformation!: agentOperationInformationModel;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLMediaElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLMediaElement>;
  remoteStream!: MediaStream;
  @Output() unSplitScreenOutput = new EventEmitter();
  // @HostListener('window:resize', ['$event'])
  // getScreenSize() {
  //     this.AgentUserInformation?.innerWidth < 769 ? this.collapsedSidebar = true : this.collapsedSidebar = false;
  //     window?.innerWidth < 769 ? this.showCollapseButton = false : this.showCollapseButton = true;
  // }
  remoteVideoObjectNormal = {
    height: '100%',
    width: '100%'
  };
  remoteVideoObjectSplitNormal = {
    height: '100%',
    width: '50%'
  };
  desktop = {
    height: '100%',
    width: '50%',
    top: 'unset',
    bottom: 'unset'
  };
  desktopNormal = {
    height: '100%',
    width: '100%',
    top: 'unset',
    bottom: 'unset'
  };

  isOpen = 0;
  disabled = true;
  color = 'default';
  @ViewChild('peerIndicator') peerIndicator!: ElementRef<HTMLMediaElement>;

  constructor(
    private Devices: DevicesInformationService,
    private render: Renderer2,
    private AgentUserInformation: AgentUserInformation,
    private CallsOperationService: CallsOperationService,
    private DevicesInformationService: DevicesInformationService
  ) {
    console.log(this.agentOperationInformation)
    this.Devices.getDeviceType() === true
      ? (this.desktop = {
        height: 'calc(50% - 24px)',
        width: '100%',
        top: 'unset',
        bottom: '0px'
      })
      : (this.desktopNormal = {
        height: '100%',
        width: '100%',
        top: 'unset',
        bottom: 'unset'
      });
    this.Devices.getDeviceType() === true
      ? (this.remoteVideoObjectSplitNormal = {
        height: 'calc(50% - 24px)',
        width: '100%'
      })
      : '';
    this.AgentUserInformation.selectedSpearkerSubject.subscribe(
      (speakerInformation) => {
        this.playSelectedAudioOutput(speakerInformation);
      }
    );
  }

  setStream(stream: MediaStream) {
    const user = this.AgentUserInformation.getCallInformation();
    if (user.is_minimize === false) {
      if (user.user_information.data.is_shared_screen === true) {
        this.render.setStyle(
          this.localVideo.nativeElement,
          'object-fit',
          'contain'
        );
      } else {
        this.render.setStyle(
          this.localVideo.nativeElement,
          'object-fit',
          'cover'
        );
      }
    }
 

    this.localVideo.nativeElement.srcObject = null;
    this.localVideo.nativeElement.srcObject = stream;
  }
  setRemoteStream(stream: MediaStream) {
    const user = this.AgentUserInformation.getCallInformation();
    user.peer_information.data.isScreenShareOn === true &&
      user.is_minimize === true
      ? this.render.setStyle(this.localVideo.nativeElement, 'display', 'none')
      : this.render.setStyle(this.localVideo.nativeElement, 'display', '');
    this.remoteVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = stream;
    this.remoteStream = stream;
    this.playSelectedAudioOutput(user.last_used_speaker);

    this.PeerVoiceIndicatior(stream, 10);
  }

  ngOnInit(): void {
    const user = this.AgentUserInformation.getCallInformation();
    this.CallsOperationService.sendPeerInformation.subscribe((data) => {
      data.isCameraOn === true || data.isScreenShareOn === true
        ? (this.isRemoteEnabled = true)
        : (this.isRemoteEnabled = false);
      data.isScreenShareOn === true
        ? this.render.setStyle(
          this.remoteVideo.nativeElement,
          'object-fit',
          'contain'
        )
        : this.render.setStyle(
          this.remoteVideo.nativeElement,
          'object-fit',
          'cover'
        );

    });
  }
  UnslplitScreen($event: boolean) {
    this.unSplitScreenOutput.emit($event);
  }

  // peer Voice Indicator
  private async PeerVoiceIndicatior(
    stream: MediaStream,
    limit: number
  ): Promise<any> {
    let audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule('/assets/vumeter.js');
    let microphone = audioContext.createMediaStreamSource(stream);
    const node = new AudioWorkletNode(audioContext, 'vumeter');
    microphone.connect(node).connect(audioContext.destination);
    node.port.onmessage = async (event) => {
      let volume = 0;
      if (event.data.volume) {
        volume = event.data.volume;
        let avg = volume * 100;
        let val = Math.round(avg);
        if (val <= limit) {
          this.render.setStyle(
            this.peerIndicator.nativeElement,
            'box-shadow',
            this.peerInidcatorData[val].data
          );
        }
      }
    };
  }
  playSelectedAudioOutput(selectedDevice: inputOuputdevices) {
    let test_output_audio1 = <
      HTMLMediaElement & { setSinkId(deviceId: string): void }
      >new Audio();
    if (
      this.remoteStream !== undefined &&
      (this.DevicesInformationService.getBrowserName() !== 'firefox' || this.DevicesInformationService.getBrowserName() !== 'safari')
    ) {
      if (this.remoteVideo.nativeElement.children.length > 0) {
        this.remoteVideo.nativeElement.volume = 0;
        this.remoteVideo.nativeElement.removeChild(
          this.remoteVideo.nativeElement.children[0]
        );
      }
      let test_audio_context1 = new AudioContext();
      let webaudio_source1 = test_audio_context1.createMediaStreamSource(
        this.remoteStream
      );
      let webaudio_ms1 = test_audio_context1.createMediaStreamDestination();
      webaudio_source1.connect(webaudio_ms1);

      test_output_audio1.srcObject = webaudio_ms1.stream;
      test_output_audio1.setSinkId(selectedDevice.id);
      this.remoteVideo.nativeElement.appendChild(test_output_audio1);
      test_output_audio1.play();
    }
  }
}
