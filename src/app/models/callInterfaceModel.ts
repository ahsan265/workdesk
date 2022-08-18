export interface CallsHeaderModel {
    name: string;
    agentImage: string;
    minimizeIcon: string;
    maximizeIcon: string;
    isMinimize: boolean;
}

export interface CallControlModel {
    buttonIconOn: string;
    buttonIconOff: string;
    backgroundColor: string;
    hoverColor: string;
    selectedButtonColor: string;
    isSelected: boolean;
    showButton: boolean;
}
export interface PeerInformationModel {
    firstName: string;
    lastName: string;
    peerImage: string;
    waitingIcon: string;
    peerVoiceIndicatorValue: number;
    showLoaderAnimation: boolean;
    showImage: boolean;
    showInitials: boolean;
    showWaitingIcon: boolean;
}
export interface PeerMiniCameraScreen {
    firstName?: string;
    lastName?: string;
    videoStream: string,
    showCamera: boolean;
    showRevertCamerIcon: boolean
    showInitals: boolean;
    showSplitIncon: boolean;
    isMobile: boolean;
    minimizeScreen: boolean;
}
export interface inputOuputdevices {
    id: string;
    groupId:string;
    name: string;
    deviceType: string;
    isSelected: boolean;
    selectedbackgroundColor: string;
    hoverColor: string;
    selectedIcon: string;
    voiceLevels: number;
}
export interface devcieInformationModel {
    title: string;
    devicePanelIcon: string;
    devices: inputOuputdevices[]

}
export interface agentOperationInformationModel{
    isMinimize:boolean;
    IsVideoMinimize:boolean;
    isScreenShareMiniMize:boolean;
}

export interface groupDeicesInformation
    {
        audioInputDevices: InputDeviceInfo[];
        audioOutputDevice: MediaDeviceInfo[];
        videoInputDevices: InputDeviceInfo[];
      }

