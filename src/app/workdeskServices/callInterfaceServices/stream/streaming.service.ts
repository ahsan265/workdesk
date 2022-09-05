import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private MessageService: MessageService,
    private PeerConnectionService: PeerConnectionService,
    private AgentUserInformation: AgentUserInformation,
    private CallSocketService: CallSocketService,
    private router: Router,
  ) { }
  // load  audio and video
  public async loadAudioandVideoResouce() {
    await navigator.mediaDevices
      .getUserMedia(this.mediaConstraint)
      .then((stream) => {
        stream.getVideoTracks()[0].stop();
        this.localStream = stream;
        this.localStream.addTrack(stream.getAudioTracks()[0]);
        this.getLocalStream.next(stream);
      });
  }
  public async sendFirstOffer(peerId: string): Promise<void> {
    const userInformation = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataforCall({
      type: 'update_peer',
      user_id: userInformation.user_information.user_id,
      data: userInformation.user_information.data
    });
    this.peerUserId = peerId;
    if (this.PeerConnectionService.peerConnection === undefined) {
      await this.PeerConnectionService.createPeerConnection();
    }
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
    this.AgentUserInformation.updateCameraStatus(false);
    const userInformation = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataforCall({
      type: 'update_peer',
      user_id: userInformation.user_information.user_id,
      data: userInformation.user_information.data
    });
    if (this.localStream?.getVideoTracks()) {
      this.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      const videoStreams = this.PeerConnectionService.peerConnection
        .getSenders()
        .filter((data: any) => {
          return data.track?.kind === 'video';
        });
      videoStreams.forEach((track) => {
        this.PeerConnectionService.peerConnection.removeTrack(track);
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
  // start video call
  public async startVideo(peerId: string): Promise<MediaStream> {
    if (this.PeerConnectionService.peerConnection === undefined) {
      await this.PeerConnectionService.createPeerConnection()
    }
    this.AgentUserInformation.updateCameraStatus(true);
    const userInformation = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataforCall({
      type: 'update_peer',
      user_id: userInformation.user_information.user_id,
      data: userInformation.user_information.data
    });
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.localStream.addTrack(stream.getVideoTracks()[0])
    const video = this.PeerConnectionService.peerConnection
      .getSenders()
      .find((data: RTCRtpSender) => {
        if (data.track != null) {
          return data.track?.kind === 'video';
        }
        else {
          return undefined;
        }
      });
    const audio = this.PeerConnectionService.peerConnection
      .getSenders()
      .find((data: RTCRtpSender) => {
        if (data.track != null) {
          return data.track?.kind === 'audio';
        }
        else {
          return undefined;
        }

      });
    (video === undefined) ?
      this.PeerConnectionService.peerConnection.addTrack(
        stream.getVideoTracks()[0],
        this.localStream
      ) : video.replaceTrack(stream.getVideoTracks()[0]);
    (audio === undefined) ? this.PeerConnectionService.peerConnection.addTrack(this.localStream.getAudioTracks()[0]) :
      audio.replaceTrack(this.localStream.getAudioTracks()[0]);
    const offer: RTCSessionDescriptionInit =
      await this.PeerConnectionService.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true
      });
    await this.PeerConnectionService.peerConnection
      .setLocalDescription(offer)
      .catch((err: any) => {
        console.log(err);
      });
    this.CallSocketService.sendDataforCall({
      type: 'offer',
      peer_id: peerId,
      data: offer
    });
    return stream;
  }

  // start screen sharing
  public async startScreenSharing(peerId: string) {
    try {
      if (this.PeerConnectionService.peerConnection === undefined) {
        await this.PeerConnectionService.createPeerConnection()
      }
      this.AgentUserInformation.updateScreenShareStutus(true);
      const userInformation = this.AgentUserInformation.getCallInformation();
      this.CallSocketService.sendDataforCall({
        type: 'update_peer',
        user_id: userInformation.user_information.user_id,
        data: userInformation.user_information.data
      });
      const media = navigator.mediaDevices as any;
      const screenShareeStream = await media.getDisplayMedia({ video: true });
      this.stopScreenShareByEvent(screenShareeStream);
      screenShareeStream.addTrack(this.localStream.getAudioTracks()[0]);
      this.localStream.addTrack(screenShareeStream.getVideoTracks()[0]);
      const video = this.PeerConnectionService.peerConnection
        .getSenders()
        .find((data: any) => {
          return data.track?.kind === 'video';
        });
      if (video === undefined) {
        this.PeerConnectionService.peerConnection.addTrack(
          screenShareeStream.getVideoTracks()[0],
          this.localStream
        );
      } else {
        video.replaceTrack(screenShareeStream.getVideoTracks()[0]);
      }
      const offer: RTCSessionDescriptionInit =
        await this.PeerConnectionService.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          iceRestart: true
        });
      await this.PeerConnectionService.peerConnection
        .setLocalDescription(offer)
        .catch((err: any) => {
          console.log(err);
        });
      this.CallSocketService.sendDataforCall({
        type: 'offer',
        peer_id: peerId,
        data: offer
      });
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
    this.CallSocketService.sendDataforCall({ type: 'hangup', data: '' });
    localStorage.removeItem('call-information');
    this.router.navigate(['customersupport']);
  }
  private stopScreenShareByEvent(stream: MediaStream) {
    stream.getTracks()[0].addEventListener('ended', () => {
      this.stopScreenStream.next(false);
      this.AgentUserInformation.updateScreenShareStutus(false);
      const userInformation = this.AgentUserInformation.getCallInformation();
      this.CallSocketService.sendDataforCall({
        type: 'update_peer',
        user_id: userInformation.user_information.user_id,
        data: userInformation.user_information.data
      });
    });
  }
  // relaod stream offer 
  public async reloadOfferSend(peerId: string) {

    const callData = this.AgentUserInformation.getCallInformation();
    if (callData.user_information.data.is_camera_on === true) {
      this.startVideo(peerId);
    }
    else if (callData.user_information.data.is_camera_on === false) {
      this.sendFirstOffer(
        peerId
      );
    }
    else if (callData.user_information.data.is_shared_screen === true) {
      this.startScreenSharing(peerId)
    }
  }
}
