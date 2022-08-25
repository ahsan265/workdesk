import { Injectable } from '@angular/core';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { environment } from 'src/environments/environment';
import { DevicesInformationService } from '../devicesInformation/devices-information.service';

@Injectable({
  providedIn: 'root'
})
export class PeerConnectionService {
  peerConnection!: RTCPeerConnection;
  iceServersConfigurations = `${environment.iceServerConfiguration}`;
  constructor(private DevicesInformationService: DevicesInformationService, private CallSocketService: CallSocketService) { }


  public async createPeerConnection(): Promise<void> {
    let iceServerSelected = [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: "turns:turn.gigaaa.com:5349",
        username: "username",
        credential: "password",
      },
    ];
    this.peerConnection = new RTCPeerConnection({
      iceServers: iceServerSelected,
      iceTransportPolicy: 'all',
      rtcpMuxPolicy: 'require',
      iceCandidatePoolSize: 2
    })
    this.eventHandlerforpeer();
  }

  eventHandlerforpeer() {
    this.peerConnection.onicecandidate = this.handIceCandidateEvent;
    this.peerConnection.oniceconnectionstatechange = this.handleIceConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStatetChangeEvent;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }
  // handle ice candidate event Function
  private handIceCandidateEvent = (event: RTCPeerConnectionIceEvent) => {

    if (event.candidate != null) {

      this.CallSocketService.sendDataforCall({
        type: 'ice-candidate',
        data: event.candidate
      });

    }
  }

  // handle ice Connection State
  private handleIceConnectionStateChangeEvent = async (event: Event) => {
    switch (this.peerConnection.iceConnectionState) {
      case "closed":
        this.peerConnection.close()
        await this.createPeerConnection();
        break;

      case "failed":
      case "disconnected":
        this.peerConnection.close()
        await this.createPeerConnection();
        break;
    }
  }
  private handleSignalingStatetChangeEvent = async (event: Event) => {
    switch (this.peerConnection.signalingState) {
      case "closed":
        this.peerConnection.close()
        await this.createPeerConnection();
        break;
    }
  }
  // handle remote stream 
  private handleTrackEvent = (event: RTCTrackEvent) => {
    console.log(event.streams[0])
  }
}
