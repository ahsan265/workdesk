import { Injectable } from '@angular/core';
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
  // get browser Name
  public getBrowserName() {
    let browserName = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case browserName.indexOf('edge') > -1:
        return 'edge';
      case browserName.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case browserName.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case browserName.indexOf('trident') > -1:
        return 'ie';
      case browserName.indexOf('firefox') > -1:
        return 'firefox';
      case browserName.indexOf('safari') > -1:
        return 'firefox';
      default:
        return 'other';
    }
  }
  // get device type
  public getDeviceType() {
    let deviceType = navigator.userAgent;
    return deviceType.includes('Mobile');
  }
}
