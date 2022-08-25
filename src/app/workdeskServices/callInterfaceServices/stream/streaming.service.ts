import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { observable, Observable, Subject } from 'rxjs';
import { CallConsoleComponent } from 'src/app/callInterface/call-console/call-console.component';
import { screenShareData } from 'src/app/callInterface/callsInterfaceData';
import { inputOuputdevices } from 'src/app/models/callInterfaceModel';
import { MessageService } from '../../messageService/message.service';

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
  getVoiceLevelSubject = new Subject<number>();
  constructor(private MessageService: MessageService) {

  }
  // load  audio and video
  public async startStream(): Promise<MediaStream> {
   await navigator.mediaDevices
      .getUserMedia(this.mediaConstraint)
      .then((stream) => {
        stream.getVideoTracks()[0].stop();
        this.localStream = stream;
       // this.localStream.addTrack(stream.getAudioTracks()[0]);
      });

    return this.localStream
  }
  // close the stream
  public closeStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    if (this.screenShareStream) {
      this.screenShareStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
  }
  // mute audio
  public muteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      })
    }
  }
  // unmute audio
  public unmunteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = true;
      })
    }

  }
  // stop video
  public stopVideo() {
    if (this.localStream?.getVideoTracks()) {
      this.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
    if (this.screenShareStream) {
      this.screenShareStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
  }
  // start video call 
  public async startVideo(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.localStream.addTrack(stream.getVideoTracks()[0]);
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
      return screenShareeStream;
    }
    catch (error: any) {
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
  }
  private stopScreenShareByEvent(stream: MediaStream) {
    stream.getTracks()[0].addEventListener('ended', () => {
      this.stopScreenStream.next(false);
    })
  }

}
