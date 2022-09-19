import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {
  devcieInformationModel,
  inputOuputdevices
} from 'src/app/models/callInterfaceModel';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { PeerConnectionService } from 'src/app/workdeskServices/callInterfaceServices/peerConnection/peer-connection.service';
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

  constructor(private StreamingService: StreamingService,
    private AgentUserInformation: AgentUserInformation,
    private PeerConnectionService: PeerConnectionService) { }

  ngOnInit() {
    const userInformation = this.AgentUserInformation.getCallInformation()
    if (userInformation.last_used_microphone === undefined) {
      this.getInputOutputDeviceInformation(this.inputDevicesData.devices[0]);
    }
    else {
      this.getInputOutputDeviceInformation(userInformation.last_used_microphone);
    }
    if (userInformation.last_used_speaker === undefined) {
      this.getInputOutputDeviceInformation(this.outputDevicesData.devices[0]);
    } else {
      this.getInputOutputDeviceInformation(userInformation.last_used_speaker);
    }
    setInterval(() => {
      this.levels += 0;
    }, 1000);
  }
  getInputOutputDeviceInformation(event: inputOuputdevices) {
    this.selectInputOutputDeviceInformation.emit(event);
    (event.deviceType === "audioinput") ?
      this.showMicroPhoneLevels(event) :
      this.AgentUserInformation.selectedSpearkerSubject.next(event);
    (event.deviceType === "audioinput") ?
      this.AgentUserInformation.updateLastUsedMicrophone(event) :
      this.AgentUserInformation.updateLastUsedSpeaker(event);

  }
  // for switching between micriphones
  public async showMicroPhoneLevels(selectedMicrophone: inputOuputdevices) {
    try {
      let constraint = { audio: { deviceId: selectedMicrophone.id } };
      if (this.StreamingService.localStream) {
        this.StreamingService.localStream.getAudioTracks().forEach(track=>{
          track.stop()
        })
      }
      navigator.mediaDevices.getUserMedia(constraint).then(async (stream) => {
        const audio = this.PeerConnectionService.peerConnection.getSenders().find((audioTrack: any) => {
          return audioTrack.track.kind === "audio";
        })
        this.StreamingService.localStream.addTrack(stream.getAudioTracks()[0]);
        audio?.replaceTrack(stream.getAudioTracks()[0]);
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

}
