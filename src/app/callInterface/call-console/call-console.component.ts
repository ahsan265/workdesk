import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';
import { CallingScreenComponent } from '../calling-screen/calling-screen.component';
import { agentOperationInformation, CallsHeaderData, cameraOnOffData, hangUpData, maxmizeScreenData, miceData, minimizeScreenData, minimizeScreenVideoData, peerMiniCameraDetails, peerUserInformationData, screenShareData, secondPeerUserInformationData } from '../callsInterfaceData';
import { OverlayService } from '../overLayService/overlay.service';

@Component({
  selector: 'app-call-console',
  templateUrl: './call-console.component.html',
  styleUrls: ['./call-console.component.scss']
})
export class CallConsoleComponent implements OnInit {
  constructor(private callInterfaceOverlay: OverlayService, private StreamingService: StreamingService) { }
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
  openDeviceSwitcher: boolean = false
  toogle: boolean = false;
  isMinimize: boolean = false;
  isVideoMinimize: boolean = false;
  minimize = minimizeScreenData;
  maximize = maxmizeScreenData;
  minimizeVideoscreen = minimizeScreenVideoData;
  peerStream!: string;

  @ViewChild('videoStream') stream!: CallingScreenComponent;

  async ngOnInit(): Promise<void> {
    await this.StreamingService.startStream();
  }
  async seletecOutputForCamera(event: boolean) {
    (event == true) ? this.stream.setStream(await this.StreamingService.startVideo()) :
      this.StreamingService.stopVideo();
    this.cameraData.isSelected = event;
    this.isVideoMinimize = event;
  }
  seletecOutputForMircrophone(event: boolean) {
    this.miceData.isSelected = event;
  }
  splitScreen(event: boolean) {
    if (event) {
      this.isSplit = event
      this.PeerMiniCameraScreen.showSplitIncon = !event;
    }
  }
  seletecOutputForScreenShare(event: boolean) {
    this.screenShareData.isSelected = event;
  }
  unSplitScreenOutput(event: boolean) {
    if (!event) {
      this.isSplit = event
      this.PeerMiniCameraScreen.showSplitIncon = !event;
    }

  }
  seletecOutputForHangUpCall(event: boolean) {
    if (event) {
      this.callInterfaceOverlay.close()
    }
  }
  openDeviceSwitcherOutput(event: boolean) {
    if (event) {
      this.openDeviceSwitcher = true;
    }

  }
  minmizeMaxmizeScreenOutput(event: boolean) {
    this.agentOperationInformationData.isMinimize = event;
    if (event) {
      if (this.isVideoMinimize) {
        this.minimize.width = '382px';
        this.minimize.height = '325px';
        this.agentOperationInformationData.IsVideoMinimize = true;
        this.PeerMiniCameraScreen.showInitals == true;
      }
      else {
        this.isMinimize = true
      }
      this.toogle = true
    }
    else {
      this.minimize.width = '255px';
      this.minimize.height = '99px';
      this.agentOperationInformationData.IsVideoMinimize = false;
      this.PeerMiniCameraScreen.showInitals == false;
      this.toogle = false;
      this.isMinimize = false;
    }
  }
}
