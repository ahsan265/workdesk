import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { loaderAnimation } from 'src/app/animations/loaderAnimation';
import { peerVoiceIndicator } from 'src/app/animations/peerinIdcators';
import {
  PeerInformationModel,
  agentOperationInformationModel
} from 'src/app/models/callInterfaceModel';
import { DevicesInformationService } from 'src/app/workdeskServices/callInterfaceServices/devicesInformation/devices-information.service';
import {
  peerNormalCallConnectedData,
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
  miniMizeVideoData = peerVideoCallConnectedData;
  maxiMizeNormaData = peerNormalCallConnectedData;
  peerInidcatorData = peerIndicatorData;
  @Input() peerInformationdata!: PeerInformationModel;
  @Input() secondPeerInformationdata!: PeerInformationModel;
  @Input() peerStream!: string;
  @Input() secondPeerStream!: string;
  @Input() isSplit: boolean = false;
  @Input() isRemoteEnabled: boolean = false;
  @Input() agentOperationInformation!: agentOperationInformationModel;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLMediaElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLMediaElement>;
  @Output() unSplitScreenOutput = new EventEmitter();

  remoteVideoObjectNormal = {
    height: '100%',
    width: '100%',
  }
  remoteVideoObjectSplitNormal = {
    height: '100%',
    width: '50%',
  }
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

  constructor(private Devices: DevicesInformationService, private render: Renderer2) {
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
      ?
      this.remoteVideoObjectSplitNormal = {
        height: 'calc(50% - 24px)',
        width: '100%',
      } :
      '';
  }

  setStream(stream: MediaStream) {
    this.localVideo.nativeElement.srcObject = null;
    this.localVideo.nativeElement.srcObject = stream;
  }
  setRemoteStream(stream: MediaStream) {
    this.remoteVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = stream;
    this.PeerVoiceIndicatior(stream, 10);
  }
  ngOnInit(): void { }
  UnslplitScreen($event: boolean) {
    this.unSplitScreenOutput.emit($event);
  }

  // peer Voice Indicator
  private async PeerVoiceIndicatior(stream: MediaStream, limit: number): Promise<any> {
    let audioContext = new AudioContext()
    await audioContext.audioWorklet.addModule('/assets/vumeter.js')
    let microphone = audioContext.createMediaStreamSource(stream)
    const node = new AudioWorkletNode(audioContext, 'vumeter');
    microphone.connect(node).connect(audioContext.destination)
    node.port.onmessage = (async (event) => {
      let volume = 0
      if (event.data.volume) {
        volume = event.data.volume;
        let avg = volume * 100;
        let val = Math.round(avg)
        console.log(val)
        if (val <= limit) {
          this.render.setStyle(this.peerIndicator.nativeElement, 'box-shadow', this.peerInidcatorData[val].data)
        }
      }
    })
  }
}
