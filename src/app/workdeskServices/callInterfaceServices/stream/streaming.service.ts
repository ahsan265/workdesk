import { ThisReceiver } from '@angular/compiler';
import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { Subject } from 'rxjs';
import { CallConsoleComponent } from 'src/app/callInterface/call-console/call-console.component';
import { miceData, screenShareData } from 'src/app/callInterface/callsInterfaceData';
import { CloseDialogOverlayRef } from 'src/app/callInterface/overLayService/closeDialogService';
import { CallsService } from 'src/app/calls/callService/calls.service';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { QueueSocketService } from 'src/app/workdeskSockets/queueSocket/queue-socket.service';
import { MessageService } from '../../messageService/message.service';
import { AgentUserInformation } from '../agentUserInformation/agent-user-information.service';
import { DevicesInformationService } from '../devicesInformation/devices-information.service';
import { PeerConnectionService } from '../peerConnection/peer-connection.service';

@Injectable({
  providedIn: 'platform'
})
export class StreamingService {
  mediaConstraint: any = {
    audio: true,
    video: true
  };
  localStream!: MediaStream;
  screenShareStream!: MediaStream;
  localVideo!: ElementRef<HTMLMediaElement>;
  callConsoleComponent!: CallConsoleComponent;
  stopScreenStream = new Subject<boolean>();
  screenShareData = screenShareData;
  getLocalStream = new Subject<MediaStream>();
  peerUserId!: string;
  setCallType = new Subject<boolean>();
  isAudioInputEnabled!: boolean;
  miceData = miceData;

  constructor(
    private MessageService: MessageService,
    private PeerConnectionService: PeerConnectionService,
    private AgentUserInformation: AgentUserInformation,
    private CallSocketService: CallSocketService,
    private DevicesInformationService: DevicesInformationService,
    private overlayService: OverlayService,
    private CallsService: CallsService,
    private QueueSocketService: QueueSocketService
  ) {
    this.PeerConnectionService.isRealoaded.subscribe((isReload) => {
      if (isReload) {
        this.reloadOfferSend(this.peerUserId);
      }
    });
  }
  // load  audio and video
  public async loadAudioandVideoResouce() {
    if (this.PeerConnectionService.peerConnection === undefined) {
      await this.PeerConnectionService.createPeerConnection();
    }
    const userInformation = this.AgentUserInformation.getCallInformation();
    if (userInformation.last_used_microphone !== undefined) {
      this.mediaConstraint.audio = { deviceId: userInformation.last_used_microphone.id }
    }
    await navigator.mediaDevices
      .getUserMedia(this.mediaConstraint)
      .then((stream) => {
        this.localStream = stream;
        stream.getVideoTracks()[0].stop()
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
    this.audioChecker();
    this.peerUserId = peerId;
    if (this.PeerConnectionService.peerConnection === undefined) {
      await this.PeerConnectionService.createPeerConnection();
    }
    const audioTrack = this.localStream.getAudioTracks()[0];
    //this.localStream.addTrack(audioTrack);
    const audio = this.PeerConnectionService.peerConnection
      .getSenders()
      .find((data: RTCRtpSender) => {
        if (data.track != null) {
          return data.track?.kind === 'audio';
        } else {
          return undefined;
        }
      });
    if (audio === undefined) {
      this.PeerConnectionService.peerConnection.addTrack(
        audioTrack,
        this.localStream
      );
    } else {
      audio.replaceTrack(audioTrack);
    } this.PeerConnectionService.getAudioCodec()
    const offer: RTCSessionDescriptionInit =
      await this.PeerConnectionService.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true
      });
    await this.PeerConnectionService.peerConnection
      .setLocalDescription(offer)
      .catch((err: any) => { });
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
      this.isAudioInputEnabled = false;
    }
  }
  // unmute audio
  public unmunteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      this.isAudioInputEnabled = true;

    }
  }
  // stop video
  public stopVideo() {
    this.AgentUserInformation.updateCameraStatus(false);
    this.AgentUserInformation.updateScreenShareStutus(false);
    const userInformation = this.AgentUserInformation.getCallInformation();
    this.audioChecker();
    if (this.localStream?.getVideoTracks()) {
      this.CallSocketService.sendDataforCall({
        type: 'update_peer',
        user_id: userInformation.user_information.user_id,
        data: userInformation.user_information.data
      });
      this.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    if (this.screenShareStream) {
      this.CallSocketService.sendDataforCall({
        type: 'update_peer',
        user_id: userInformation.user_information.user_id,
        data: userInformation.user_information.data
      });
      this.screenShareStream
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => {
          track.stop();
        });
    }
  }
  // start video call
  public async startVideo(peerId: string): Promise<MediaStream> {
    let mediastream: any;
    if (this.PeerConnectionService.peerConnection === undefined) {
      await this.PeerConnectionService.createPeerConnection();
    }
    this.AgentUserInformation.updateCameraStatus(true);
    const userInformation = this.AgentUserInformation.getCallInformation();
    this.audioChecker();
    this.CallSocketService.sendDataforCall({
      type: 'update_peer',
      user_id: userInformation.user_information.user_id,
      data: userInformation.user_information.data
    });
    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        mediastream = stream;
        this.getLocalStream.next(stream);
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = true;
        const audioTrack = this.localStream.getAudioTracks()[0];
        this.localStream.addTrack(videoTrack);
        this.localStream.addTrack(audioTrack);
        const audio = this.PeerConnectionService.peerConnection
          .getSenders()
          .find((data: RTCRtpSender) => {
            if (data.track != null) {
              return data.track?.kind === 'audio';
            } else {
              return undefined;
            }
          });
        const video = this.PeerConnectionService.peerConnection
          .getSenders()
          .find((data: RTCRtpSender) => {
            if (data.track != null) {
              return data.track?.kind === 'video';
            } else {
              return undefined;
            }
          });

        audio === undefined
          ? this.PeerConnectionService.peerConnection.addTrack(
            audioTrack,
            this.localStream
          )
          : audio.replaceTrack(audioTrack);
        video === undefined
          ? this.PeerConnectionService.peerConnection.addTrack(
            videoTrack,
            this.localStream
          )
          : video.replaceTrack(videoTrack);
      })
      .then(async () => {
        //this.PeerConnectionService.getVideoCodec();
        const offer: RTCSessionDescriptionInit =
          await this.PeerConnectionService.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            iceRestart: true
          });
        await this.PeerConnectionService.peerConnection
          .setLocalDescription(offer)
          .catch((err: any) => { });
        this.restoreLastUsedMicrophone();
        this.CallSocketService.sendDataforCall({
          type: 'offer',
          peer_id: peerId,
          data: offer
        });
      });
    return mediastream;
  }

  // start screen sharing
  public async startScreenSharing(peerId: string) {
    try {
      if (this.PeerConnectionService.peerConnection === undefined) {
        await this.PeerConnectionService.createPeerConnection();
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
      this.screenShareStream = screenShareeStream;
      this.stopScreenShareByEvent(screenShareeStream);
      const localAudio = this.localStream.getAudioTracks()[0];
      const videotrack = screenShareeStream.getVideoTracks()[0];
      this.localStream.addTrack(videotrack);
      const video = this.PeerConnectionService.peerConnection
        .getSenders()
        .find((data: any) => {
          return data.track?.kind === 'video';
        });
      const audio = this.PeerConnectionService.peerConnection
        .getSenders()
        .find((data: any) => {
          return data.track?.kind === 'audio';
        });
      if (video === undefined) {
        this.PeerConnectionService.peerConnection.addTrack(
          screenShareeStream.getVideoTracks()[0],
          this.localStream
        );
      } else {
        video.replaceTrack(screenShareeStream.getVideoTracks()[0]);
      }
      // for audio track
      if (audio === undefined) {
        this.PeerConnectionService.peerConnection.addTrack(localAudio, this.localStream)
      } else {
        audio.replaceTrack(localAudio);
      }
      this.audioChecker();
      //this.PeerConnectionService.getVideoCodec();
      const offer: RTCSessionDescriptionInit =
        await this.PeerConnectionService.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          iceRestart: true
        });
      await this.PeerConnectionService.peerConnection
        .setLocalDescription(offer)
        .catch((err: any) => { });
      this.restoreLastUsedMicrophone();
      this.CallSocketService.sendDataforCall({
        type: 'offer',
        peer_id: peerId,
        data: offer
      });
      this.stopScreenStream.next(true);
      return screenShareeStream;
    } catch (error: any) {
      this.MessageService.setErrorMessage('Permission Denied');
      this.AgentUserInformation.updateScreenShareStutus(false);
      this.stopScreenStream.next(false);
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
    this.CallSocketService.ws.close();
    // this.router.navigate(['customersupport']);
    localStorage.removeItem('call-information');
    this.overlayService.close();
    const data = this.QueueSocketService.defaultCallData;
    this.CallsService.sendDataToTabs(data.incoming, 'incoming');
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
    if (
      callData.user_information.data.is_camera_on === true &&
      callData.user_information.data.is_shared_screen === false
    ) {
      this.startVideo(peerId);
    } else if (
      callData.user_information.data.is_camera_on === false &&
      callData.user_information.data.is_shared_screen === false
    ) {
      this.sendFirstOffer(peerId);
    } else if (callData.user_information.data.is_shared_screen === true) {
      if (this.screenShareStream) {
        const videoTrack = this.screenShareStream.getVideoTracks()[0];
        this.screenShareStream.addTrack(videoTrack);
        this.audioChecker();
        const audio = this.PeerConnectionService.peerConnection
          .getSenders()
          .find((data: RTCRtpSender) => {
            if (data.track != null) {
              return data.track?.kind === 'audio';
            } else {
              return undefined;
            }
          });
        if (audio === undefined) {
          this.PeerConnectionService.peerConnection.addTrack(
            this.localStream.getAudioTracks()[0]
          );
        } else {
          audio.replaceTrack(this.screenShareStream.getAudioTracks()[0]);
        }
        this.PeerConnectionService.peerConnection.addTrack(
          videoTrack,
          this.screenShareStream
        );
        // this.PeerConnectionService.getVideoCodec();
        const offer: RTCSessionDescriptionInit =
          await this.PeerConnectionService.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            iceRestart: true
          });

        await this.PeerConnectionService.peerConnection.setLocalDescription(
          offer
        );
        this.CallSocketService.sendDataforCall({
          type: 'offer',
          peer_id: peerId,
          data: offer
        });
      } else {
        this.AgentUserInformation.updateScreenShareStutus(false);
        this.sendFirstOffer(peerId);

      }
    }
    this.restoreLastUsedMicrophone();
  }

  // detect devices
  public async detectDevicesMicrphoneDeviceOnchange(): Promise<void> {
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      await this.selectedDeviceForStream(true);
    });
  }

  // selected Devices
  public async selectedDeviceForStream(replaceTrack: boolean) {
    const devices = await this.DevicesInformationService.getAllDevice();
    const selectedMicrophone = {
      id: devices.audioInputDevices[0].deviceId,
      groupId: devices.audioInputDevices[0].groupId,
      name: devices.audioInputDevices[0].label,
      deviceType: devices.audioInputDevices[0].kind,
      isSelected: true,
      selectedbackgroundColor: '#243247',
      hoverColor: '',
      selectedIcon: '../../../assets/images/callInterface/green_check_icon.svg',
      voiceLevels: 0
    };
    this.AgentUserInformation.updateLastUsedMicrophone(selectedMicrophone);
    if (replaceTrack === true) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.stop();
      });
      const idOfMicrophone = devices.audioInputDevices[0].deviceId;
      let constraint = { audio: { deviceId: idOfMicrophone } };
      navigator.mediaDevices.getUserMedia(constraint).then(async (stream) => {
        this.localStream.addTrack(stream.getAudioTracks()[0]);
        const audio = this.PeerConnectionService.peerConnection
          .getSenders()
          .find((audioTrack: any) => {
            return audioTrack.track.kind === 'audio';
          });
        audio?.replaceTrack(stream.getAudioTracks()[0]);
      });
    }
    if (this.DevicesInformationService.getBrowserName() !== 'firefox' || this.DevicesInformationService.getBrowserName() !== 'safari') {
      const selectedSpeaker = {
        id: devices.audioOutputDevice[0].deviceId,
        groupId: devices.audioOutputDevice[0].groupId,
        name: devices.audioOutputDevice[0].label,
        deviceType: devices.audioOutputDevice[0].kind,
        isSelected: true,
        selectedbackgroundColor: '#243247',
        hoverColor: '',
        selectedIcon: '../../../assets/images/callInterface/green_check_icon.svg',
        voiceLevels: 0
      };
      this.AgentUserInformation.updateLastUsedSpeaker(selectedSpeaker);
    }
  }

  // onrefresh restore last used microphone
  public restoreLastUsedMicrophone() {
    const userInformation = this.AgentUserInformation.getCallInformation();
    if (userInformation.last_used_microphone !== undefined) {

      const idOfMicrophone = userInformation.last_used_microphone.id;
      let constraint = { audio: { deviceId: idOfMicrophone } };
      navigator.mediaDevices.getUserMedia(constraint).then(async (stream) => {
        this.localStream.addTrack(stream.getAudioTracks()[0]);
        this.audioChecker();
        const audio = this.PeerConnectionService.peerConnection
          .getSenders()
          .find((audioTrack: any) => {
            return audioTrack.track.kind === 'audio';
          });
        if (this.DevicesInformationService.getBrowserName() !== 'firefox') {
          audio?.replaceTrack(stream.getAudioTracks()[0]);
        }
      });
    }
  }

  // checker for audio 
  audioChecker() {
    if (this.miceData.isSelected === true) {
      this.unmunteAudio();
    }
    else {
      this.muteAudio();
    }
  }


}
