import { Injectable } from '@angular/core';
import { PeersCallsInformationModel } from 'src/app/models/callInterfaceModel';
import { User } from 'src/app/models/user';
import { DevicesInformationService } from '../devicesInformation/devices-information.service';

@Injectable({
  providedIn: 'root'
})
export class AgentUserInformation {

  constructor(private DevicesInformationService: DevicesInformationService) { }

  public getCallInformation() {
    return JSON.parse(localStorage.getItem("call-information") || '{}');
  }

  public getUserNameInitals(user: User) {
    let firstNameInitial = user.profile.first_name?.toUpperCase().charAt(0);
    let lastNameInitial = user.profile.last_name?.toUpperCase().charAt(0);
    return {
      firstNameInitial: firstNameInitial, lastNameInitial: lastNameInitial
    };
  }

  public setRefreshStatus(userId: string, status: boolean) {
    const data = this.getCallInformation();
    data['is_refreshed'] = status;
    localStorage.setItem('call-information', JSON.stringify(data));
  }
  // save user Information
  public saveUserInformation(userId: string, isCameraOn: boolean, isMicrophoneOn: boolean, isSharedScreenOn: boolean, user: User) {
    const data = this.getCallInformation();
    data['user_information'] = { "user_id": userId, "data": { "is_camera_on": isCameraOn, "is_microphone_on": isMicrophoneOn, "is_shared_screen": isSharedScreenOn, "first_name": user.profile.first_name, "last_name": user.profile.last_name, "img_url": user.profile.image, "is_mobile": this.DevicesInformationService.getDeviceType() } }
    localStorage.setItem('call-information', JSON.stringify(data))
  }
  // save peer information
  public savePeerInformation(peersInformation: PeersCallsInformationModel) {
    this.getCallInformation()['peer_information'] = { "peer_id": peersInformation.peerId, "data": { display_name: peersInformation.display_name, "is_camera_on": peersInformation.isCameraOn, "is_microphone_on": peersInformation.isMicrophoneOn, "is_shared_screen": peersInformation.isScreenShareOn, "first_name": peersInformation.firstName, "last_name": peersInformation.lastName, "img_url": peersInformation.peerImage, "is_mobile": peersInformation.deviceType } }
    localStorage.setItem('call-information', JSON.stringify(this.getCallInformation()));
  }

}
