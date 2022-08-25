import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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

@Component({
  selector: 'app-calling-screen',
  templateUrl: './calling-screen.component.html',
  styleUrls: ['./calling-screen.component.scss'],
  animations: [peerVoiceIndicator, loaderAnimation]
})
export class CallingScreenComponent implements OnInit {
  miniMizeVideoData = peerVideoCallConnectedData;
  maxiMizeNormaData = peerNormalCallConnectedData;
  @Input() peerInformationdata!: PeerInformationModel;
  @Input() secondPeerInformationdata!: PeerInformationModel;
  @Input() peerStream!: string;
  @Input() secondPeerStream!: string;
  @Input() isSplit: boolean = false;
  @Input() agentOperationInformation!: agentOperationInformationModel;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLMediaElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLMediaElement>;
  @Output() unSplitScreenOutput = new EventEmitter();

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
  }

  isOpen = 0;
  disabled = true;
  color = 'default';
  constructor(private Devices: DevicesInformationService) {
    (this.Devices.getDeviceType() === true) ? this.desktop = { height: 'calc(50% - 24px)', width: '100%', top: 'unset', bottom: '0px' } :
      this.desktopNormal = { height: '100%', width: '100%', top: 'unset', bottom: 'unset' }
  }

  setStream(stream: MediaStream) {
    this.localVideo.nativeElement.srcObject = null;
    this.localVideo.nativeElement.srcObject = stream;
  }
  setRemoteStream(stream: MediaStream) {
    this.remoteVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = stream;
  }
  ngOnInit(): void { }
  UnslplitScreen($event: boolean) {
    this.unSplitScreenOutput.emit($event);
  }

}
