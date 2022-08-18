import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { loaderAnimation } from 'src/app/animations/loaderAnimation';
import { peerVoiceIndicator } from 'src/app/animations/peerinIdcators';
import { agentOperationInformationModel, PeerInformationModel } from 'src/app/models/callInterfaceModel';
import { peerNormalCallConnectedData, peerVideoCallConnectedData } from '../callsInterfaceData';

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

  isOpen = 0;
  disabled = true;
  color = 'default';
  constructor() { }


  setStream(stream:MediaStream)
  {
    this.localVideo.nativeElement.srcObject = stream;
  }
  ngOnInit(): void {
  }
  UnslplitScreen($event: boolean) {
    this.unSplitScreenOutput.emit($event)
  }
}
