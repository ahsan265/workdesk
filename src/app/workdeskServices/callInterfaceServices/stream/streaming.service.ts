import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {
  mediaConstraint = {
    video: true,
    audio: true
  };
  localStream!: MediaStream;
  constructor() {}
  localVideo!: ElementRef<HTMLMediaElement>;

  // load  audio and video
  public async startStream(): Promise<MediaStream> {
    await navigator.mediaDevices
      .getUserMedia(this.mediaConstraint)
      .then((stream) => {
        stream.getVideoTracks()[0].stop();
        this.localStream = stream;
      });

    return this.localStream;
  }
  // close the stream
  public closeStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
  }
  // mute audio
  public muteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks()[0].enabled = false;
    }
  }
  // unmute audio
  public unmunteAudio() {
    if (this.localStream) {
      this.localStream.getAudioTracks()[0].enabled = true;
    }
  }
  // stop video
  public stopVideo() {
    if (this.localStream?.getVideoTracks()) {
      this.localStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
  }
  //
  public async startVideo(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.localStream.addTrack(stream.getVideoTracks()[0]);
    return stream;
  }
}
