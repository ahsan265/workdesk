import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { retry } from 'rxjs/operators';
import { groupDeicesInformation } from 'src/app/models/callInterfaceModel';

@Injectable({
  providedIn: 'root'
})
export class DevicesInformationService {
  constructor() {}

  public async getAllDevice(): Promise<groupDeicesInformation> {
    const audioInput: InputDeviceInfo[] = [];
    const audioOutput: MediaDeviceInfo[] = [];
    const videoInput: InputDeviceInfo[] = [];
    await navigator.mediaDevices.enumerateDevices().then((device) => {
      device.forEach((data) => {
        if (data.kind === 'audioinput') {
          audioInput.push(data);
        } else if (data.kind === 'audiooutput') {
          audioOutput.push(data);
        } else if (data.kind === 'videoinput') {
          videoInput.push(data);
        }
      });
    });
    const data: groupDeicesInformation = {
      audioInputDevices: audioInput,
      audioOutputDevice: audioOutput,
      videoInputDevices: videoInput
    };
    return data;
  }
}
