import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CallConsoleComponent } from 'src/app/callInterface/call-console/call-console.component';
import { screenShareData } from 'src/app/callInterface/callsInterfaceData';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { MessageService } from '../../messageService/message.service';
import { AgentUserInformation } from '../agentUserInformation/agent-user-information.service';
import { PeerConnectionService } from '../peerConnection/peer-connection.service';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {
  mediaConstraint = {
    video: true,
    audio: true
  };
  localStream!: MediaStream;
  screenShareStream!: MediaStream;
  localVideo!: ElementRef<HTMLMediaElement>;
  callConsoleComponent!: CallConsoleComponent;
  stopScreenStream = new Subject<boolean>();
  screenShareData = screenShareData;
  getLocalStream = new Subject<MediaStream>();
  peerUserId!: string;

  constructor(private MessageService: MessageService, private PeerConnectionService: PeerConnectionService,
    private AgentUserInformation: AgentUserInformation,
    private CallSocketService: CallSocketService) { }
  // load  audio and video
  public async loadAudioandVideoResouce() {
    await navigator.mediaDevices
      .getUserMedia(this.mediaConstraint)
      .then((stream) => {
        //  stream.getVideoTracks()[0].stop();
        this.localStream = stream;
        this.getLocalStream.next(stream)
      });
  }
  public async sendFirstOffer(peerId: string, userId: string): Promise<void> {
    const userInformation = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataforCall({ "type": "update_peer", "user_id": userId, "data": userInformation.user_information.data })
    this.peerUserId = peerId;
    await this.PeerConnectionService.createPeerConnection();
    const streamData = this.localStream;
    const audioTrack = streamData.getAudioTracks()[0];
    streamData.addTrack(audioTrack);
    this.PeerConnectionService.peerConnection.addTrack(audioTrack, streamData);
    const offer: RTCSessionDescriptionInit =
      await this.PeerConnectionService.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true
      });
    await this.PeerConnectionService.peerConnection
      .setLocalDescription(offer)
      .catch((err: any) => {
        // console.log(err);
      });
    this.CallSocketService.sendDataforCall({
      type: 'offer',
      peer_id: peerId,
      data: offer
    });

  }

  // close the stream
  public closeStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    if (this.screenShareStream) {
      this.screenShareStream
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => {
          track.stop();
        });
    }
  }
  // mute audio
  public muteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }
  // unmute audio
  public unmunteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    }
  }
  // stop video
  public stopVideo() {
    if (this.localStream?.getVideoTracks()) {
      this.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      const videoStreams = this.PeerConnectionService.peerConnection.getSenders().filter((data: any) => {
        return data.track?.kind === "video";
      });
      videoStreams.forEach(track => {
        this.PeerConnectionService.peerConnection.removeTrack(track)
      })
    }
    if (this.screenShareStream) {
      this.screenShareStream
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => {
          track.stop();
        });
    }
  }
  // start video call
  public async startVideo(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.localStream.addTrack(stream.getVideoTracks()[0]);
    const video = this.PeerConnectionService.peerConnection.getSenders().find((data: RTCRtpSender) => {
      return data.track?.kind === "video";
    });
    if (video === undefined) {
      this.PeerConnectionService.peerConnection.addTrack(stream.getVideoTracks()[0], this.localStream);
    }
    else {
      video.replaceTrack(stream.getVideoTracks()[0]);
    }
    const offer: RTCSessionDescriptionInit = await this.PeerConnectionService.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      iceRestart: true
    });
    await this.PeerConnectionService.peerConnection.setLocalDescription(offer).catch((err: any) => {
      console.log(err)
    })
    this.CallSocketService.sendDataforCall({ type: "offer", peer_id: this.peerUserId, data: offer });
    return stream;
  }

  // start screen sharing
  public async startScreenSharing() {
    try {
      const media = navigator.mediaDevices as any;
      const screenShareeStream = await media.getDisplayMedia({ video: true });
      this.stopScreenShareByEvent(screenShareeStream);
      screenShareeStream.addTrack(this.localStream.getAudioTracks()[0]);
      this.localStream.addTrack(screenShareeStream.getVideoTracks()[0]);
      const video = this.PeerConnectionService.peerConnection.getSenders().find((data: any) => {
        return data.track?.kind === "video";
      });
      if (video === undefined) {
        this.PeerConnectionService.peerConnection.addTrack(screenShareeStream.getVideoTracks()[0], this.localStream);
      }
      else {
        video.replaceTrack(screenShareeStream.getVideoTracks()[0]);
      }
      const offer: RTCSessionDescriptionInit = await this.PeerConnectionService.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true
      });
      await this.PeerConnectionService.peerConnection.setLocalDescription(offer).catch((err: any) => {
        console.log(err)
      })
      this.CallSocketService.sendDataforCall({ type: "offer", peer_id: this.peerUserId, data: offer });
      return screenShareeStream;
    } catch (error: any) {
      this.MessageService.setErrorMessage('Permission Denied');
    }
    return this.localStream;
  }

  // call hanup

  public hangUpCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    if (this.screenShareStream) {
      this.screenShareStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    this.CallSocketService.sendDataforCall({ type: "hangup", data: "" });
  }
  private stopScreenShareByEvent(stream: MediaStream) {
    stream.getTracks()[0].addEventListener('ended', () => {
      this.stopScreenStream.next(false);
    });
  }
}
