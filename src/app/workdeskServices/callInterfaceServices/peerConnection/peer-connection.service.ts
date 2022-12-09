import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { DevicesInformationService } from '../devicesInformation/devices-information.service';

@Injectable({
  providedIn: 'platform'
})
export class PeerConnectionService {
  peerConnection!: RTCPeerConnection;
  remoteVideoSubject = new Subject<MediaStream>();
  remoteStream!: MediaStream;
  isRealoaded = new Subject<boolean>();
  checkedRemoteSet: boolean = false;
  candidates: any[] = [];

  constructor(
    private CallSocketService: CallSocketService,
    private DevicesInformationService: DevicesInformationService
  ) { }

  public async createPeerConnection(): Promise<void> {
    let forTurnsSupported = [
      {
        urls: 'stun:stun.l.google.link:19302'
      },
      {
        urls: 'turns:turn.gigaaa.link:5349',
        username: 'username',
        credential: 'password'
      }
    ];

    let iceserversConfigs = [
      {
        urls: 'stun:stun.l.google.link:19302'
      },
      {
        urls: 'turn:turn.gigaaa.link:80',
        username: 'username',
        credential: 'password'
      },
      {
        urls: 'turn:turn.gigaaa.link:443',
        username: 'username',
        credential: 'password'
      },
      {
        urls: 'turns:turn.gigaaa.link:5349',
        username: 'username',
        credential: 'password'
      },
      {
        urls: 'turn:turn.gigaaa.link:3478',
        username: 'username',
        credential: 'password'
      }
      ,
      {
        urls: 'turns:turn.gigaaa.link:3478?transport=tcp',
        username: 'username',
        credential: 'password'
      }
    ];
    let turnConfig = [];
    if (this.DevicesInformationService.getBrowserName() === 'firefox') {
      turnConfig = forTurnsSupported;
    } else {
      turnConfig = iceserversConfigs;
    }
    this.peerConnection = new RTCPeerConnection({
      iceServers: turnConfig,
      iceTransportPolicy: 'all',
      rtcpMuxPolicy: 'require',
      iceCandidatePoolSize: 10
    });
    this.eventHandlerforpeer();
  }

  private eventHandlerforpeer() {
    this.peerConnection.onicecandidate = this.handIceCandidateEvent;
    this.peerConnection.oniceconnectionstatechange =
      this.handleIceConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange =
      this.handleSignalingStatetChangeEvent;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }
  // handle ice candidate event Function
  private handIceCandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate !== null) {
      {
        this.CallSocketService.sendDataforCall({
          type: 'ice-candidate',
          data: event.candidate
        });
      }
    }
  };

  // handle ice Connection State
  private handleIceConnectionStateChangeEvent = async (event: Event) => {
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
        this.peerConnection.close();
        await this.createPeerConnection();
        this.isRealoaded.next(true);
        break;
      case 'failed':
      case 'disconnected':
        this.peerConnection.close();
        await this.createPeerConnection();
        this.isRealoaded.next(true);
        break;
    }
  };
  private handleSignalingStatetChangeEvent = async (event: Event) => {
    switch (this.peerConnection.signalingState) {
      case 'closed':
        this.peerConnection.close();
        await this.createPeerConnection();
        this.isRealoaded.next(true);
        break;
    }
  };
  // handle remote stream
  private handleTrackEvent = (event: RTCTrackEvent) => {
    this.remoteStream = event.streams[0];
    this.remoteVideoSubject.next(event.streams[0]);
    this.remoteVideoSubject.next(event.streams[0]);
  };

  // handle Offer messager After recieving offer from peer candidate.
  public async handlOfferMessage(
    msg: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.peerConnection
      .setRemoteDescription(msg)
      .then(async () => {
        return await this.peerConnection.createAnswer();
      })
      .then(async (answer) => {
        await this.peerConnection.setLocalDescription(
          answer
        );
        if (this.candidates.length != 0) {
          this.candidates.map((c) => this.peerConnection.addIceCandidate(c));
        }
      })
      .then(() => {
        this.CallSocketService.sendDataforCall({
          type: 'answer',
          data: this.peerConnection.localDescription
        });
      })
      .catch(async (error: any) => {
        this.peerConnection.close();
        await this.createPeerConnection();
        this.isRealoaded.next(true);
      });
  }

  // handle answer message
  public async handleAnswerMessage(
    data: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.peerConnection
      .setRemoteDescription(new RTCSessionDescription(data))
      .catch(async (error: any) => { });
      if (this.candidates.length != 0) {
        this.candidates.map((c) => this.peerConnection.addIceCandidate(c));
      }
  }
  // handle ice Condate Messages
  public async handleIceCandidateMessage(data: RTCIceCandidate): Promise<void> {
    if (data.candidate !== "") {
      await this.peerConnection
        .addIceCandidate(data)
        .catch((error: any) => { });
        (this.DevicesInformationService.getBrowserName() === 'firefox') ? this.candidates.push(data) : this.candidates = [];
    }
   
  }
}
