import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {
  devcieInformationModel,
  inputOuputdevices
} from 'src/app/models/callInterfaceModel';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';

@Component({
  selector: 'app-devices-switcher',
  templateUrl: './devices-switcher.component.html',
  styleUrls: ['./devices-switcher.component.scss']
})
export class DevicesSwitcherComponent implements OnInit {
  @Input() inputDevicesData!: devcieInformationModel;
  @Input() outputDevicesData!: devcieInformationModel;
  @Output() selectInputOutputDeviceInformation = new EventEmitter();
  @Output() splitScreenOutput = new EventEmitter();
  voiceLevels!: Observable<number>;
  levels: number = 0;

  constructor(private StreamingService: StreamingService) {}

  ngOnInit() {
    this.getInputOutputDeviceInformation(this.inputDevicesData.devices[0]);
    setInterval(() => {
      this.levels += 0;
    }, 1000);
  }
  getInputOutputDeviceInformation(event: inputOuputdevices) {
    this.selectInputOutputDeviceInformation.emit(event);
    this.showMicroPhoneLevels(event);
  }
  // for switching between micriphones
  public async showMicroPhoneLevels(selectedMicrophone: inputOuputdevices) {
    try {
      let constraint = { audio: { deviceId: selectedMicrophone.id } };
      if (this.StreamingService.localStream) {
        this.StreamingService.localStream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }
      navigator.mediaDevices.getUserMedia(constraint).then(async (stream) => {
        this.StreamingService.localStream.addTrack(stream.getAudioTracks()[0]);
        const audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule('assets/vumeter.js');
        let microphone = audioContext.createMediaStreamSource(stream);
        const node = new AudioWorkletNode(audioContext, 'vumeter');
        microphone.connect(node).connect(audioContext.destination);
        node.port.onmessage = (event) => {
          let volume = 0;
          if (event.data.volume) {
            volume = event.data.volume;
            let average = volume * 100;
            this.levels = Math.round(average);
          }
        };
      });
    } catch (err) {
      //  console.log(err);
    }
  }

  // for switching between Speakers
  private switchSpeakers(
    selectedSpeakers: inputOuputdevices,
    remoteStream: MediaStream
  ) {
    try {
      // if (this.remotevideo.nativeElement.children.length > 0) {
      //   this.remotevideo.nativeElement.volume = 0;
      //   this.remotevideo.nativeElement.removeChild(this.remotevideo.nativeElement.children[0])
      // }
      // this.outputDeviceid = Val.data.deviceId;
      // let mediaStream = this.remotetrackEvent;
      let test_audio_context1 = new AudioContext();
      let webaudio_source1 =
        test_audio_context1.createMediaStreamSource(remoteStream);
      let webaudio_ms1 = test_audio_context1.createMediaStreamDestination();
      webaudio_source1.connect(webaudio_ms1);
      let test_output_audio1 = <
        HTMLMediaElement & { setSinkId(deviceId: string): void }
      >new Audio();
      test_output_audio1.srcObject = webaudio_ms1.stream;

      test_output_audio1.setSinkId(selectedSpeakers.groupId);
      //  this.remotevideo.nativeElement.appendChild(test_output_audio1);
      test_output_audio1.play();
    } catch (err: any) {}
  }
}
