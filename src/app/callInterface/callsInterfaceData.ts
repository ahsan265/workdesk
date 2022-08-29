import {
  CallControlModel,
  CallsHeaderModel,
  PeerInformationModel,
  PeerMiniCameraScreen,
  agentOperationInformationModel,
  devcieInformationModel
} from '../models/callInterfaceModel';

const CallsHeaderData: CallsHeaderModel = {
  agentImage: '../../../assets/images/callInterface/ahsan.jpg',
  isMinimize: true,
  name: 'Anon anon',
  initials:'AA',
  minimizeIcon: '../../../assets/images/callInterface/minimizeicon.svg',
  maximizeIcon: '../../../assets/images/callInterface/maximizeicon.svg'
};
const miceData: CallControlModel = {
  buttonIconOn: '../../../assets/images/callInterface/microphone.svg',
  buttonIconOff: '../../../assets/images/callInterface/microphone_off.svg',
  backgroundColor: 'rgb(28, 84, 219)',
  isSelected: true,
  showButton: true,
  selectedButtonColor: ''
};
const cameraOnOffData: CallControlModel = {
  buttonIconOn: '../../../assets/images/callInterface/video.svg',
  buttonIconOff: '../../../assets/images/callInterface/camera_off.svg',
  backgroundColor: 'rgb(28, 84, 219)',
  isSelected: false,
  showButton: true,
  selectedButtonColor: 'rgb(28, 84, 219)'
};
const screenShareData: CallControlModel = {
  buttonIconOn: '../../../assets/images/callInterface/sharing.svg',
  buttonIconOff: '../../../assets/images/callInterface/sharing.svg',
  backgroundColor: 'rgb(28, 84, 219)',
  isSelected: false,
  showButton: true,
  selectedButtonColor: 'rgb(28, 84, 219)'
};
const hangUpData: CallControlModel = {
  buttonIconOn: '../../../assets/images/callInterface/endcall.svg',
  buttonIconOff: '../../../assets/images/callInterface/endcall.svg',
  backgroundColor: '#FF155A',
  isSelected: true,
  showButton: true,
  selectedButtonColor: '#FF155A'
};
const peerUserInformationData: PeerInformationModel = {
  firstName: 'Anon',
  lastName: 'Anon',
  peerImage: '../../../assets/images/callInterface/ahsan.jpg',
  waitingIcon: '../../../assets/images/callInterface/waiting_large.svg',
  peerVoiceIndicatorValue: 0,
  showImage: false,
  showInitials: true,
  showLoaderAnimation: false,
  showWaitingIcon: false,
  showVideo: false,
  showShareScreen: false,
  initials:'AA'
};
const secondPeerUserInformationData: PeerInformationModel = {
  firstName: 'Muhammad',
  lastName: 'Ahsan',
  peerImage: '../../../assets/images/callInterface/ahsan.jpg',
  waitingIcon: '../../../assets/images/callInterface/waiting_large.svg',
  peerVoiceIndicatorValue: 0,
  showImage: false,
  showInitials: true,
  showLoaderAnimation: false,
  showWaitingIcon: false,
  showVideo: false,
  showShareScreen: false,
  initials:'AA'
};

const peerMiniCameraDetails: PeerMiniCameraScreen = {
  firstName: 'Muhammad',
  lastName: 'Afzal',
  showCamera: false,
  showRevertCamerIcon: true,
  showInitals: true,
  showSplitIncon: true,
  isMobile: false,
  minimizeScreen: false
};
const inputDevices: devcieInformationModel = {
  title: 'Microphones',
  devicePanelIcon: '../../../assets/images/callInterface/microphone.svg',
  devices: []
};

const outputDevice: devcieInformationModel = {
  title: 'Speakers',
  devicePanelIcon: '../../../assets/images/callInterface/speakers_icon.svg',
  devices: []
};
/// minimize and maximize screens
const minimizeScreenData = {
  height: '99px',
  position: 'fixed',
  bottom: 0,
  overflow: 'hidden',
  width: '255px',
  'border-radius': '4px',
  margin: '0 auto'
};

const minimizeScreenVideoData = {
  height: '325px',
  position: 'fixed',
  bottom: 0,
  overflow: 'hidden',
  width: '382px',
  'border-radius': '4px',
  margin: '0 auto'
};

const maxmizeScreenData = {
  height: '100%',
  top: 0,
  left: 0,
  transform: 'unset'
};
const minimizeHeaderData = {
  height: '50px',
  background: '#2B3A51',
  imageData: {
    width: '30px',
    height: '30px',
    'border-radius': '50%',
    margin: '11px 10px 10px 10px'
  },
  nameData: {
    'font-size': '14px'
  },
  internetIndicatorData: {
    padding: '18px 12px 0px 13px',
    'vertical-align': 'top'
  }
};

const maximizeHeaderData = {
  width: '100%',
  height: '78px',
  imageData: {
    width: '33px',
    height: '33px',
    'border-radius': '50%',
    margin: '21px 30px 21px 30px'
  },
  nameData: {
    'font-size': '16px'
  },
  internetIndicatorData: {
    padding: '31px 21px 30px 30px'
  }
};

const allMinimize = {
  isMinimize: false
};
const minimizeCallControlData = {
  height: '50px',
  width: '255px',
  background: '#162741',
  'margin-bottom': '0px',
  bottom: '22px',
  'border-radius': '1px'
};

const videoMinimizeControlData = {
  height: '55px',
  width: '255px',
  background: '#162741',
  'margin-bottom': '10px',
  bottom: '20px',
  'border-radius': '51px'
};

const maximizeCallControlData = {
  width: '255px',
  height: 'inherit'
};

// for calling screeen peers circles
const peerVideoCallConnectedData = {
  height: '90px',
  width: '90px',
  top: 'calc(100% - 245px)'
};
const peerNormalCallConnectedData = {
  height: '198px',
  width: '198px',
  top: 'calc(50% - 160px)'
};
// for mini camera screeen on

const agentOperationInformation: agentOperationInformationModel = {
  isMinimize: false,
  isScreenShareMiniMize: false,
  IsVideoMinimize: false
};
// for video minimize mini camera screen
const minimizeMiniCameraScreen = {
  width: '111.43px',
  height: '71px'
};
const normalMinicameraScreen = {
  width: '226px',
  height: '144px'
};
// for video minimize split icon
const minimizeSplitIcon = {
  width: '30px',
  height: '30px'
};
const normalSplitIcon = {
  width: '35px',
  height: '35px'
};

// for peer camera initials
const minimizeMiniCameraScreenInitials = {
  'font-size': '12px',
  bottom: '26px'
};
const normalMinimizeCameraScreenInitials = {
  'font-size': '40px',
  bottom: '63px'
};
// for peer mini camera full
const miniCameraFullName = {
  display: 'none'
};

const normalMiniCameraFullName = {
  display: 'unset'
};
export {
  CallsHeaderData,
  miceData,
  cameraOnOffData,
  screenShareData,
  hangUpData,
  peerUserInformationData,
  secondPeerUserInformationData,
  peerMiniCameraDetails,
  inputDevices,
  outputDevice,
  minimizeScreenData,
  maxmizeScreenData,
  minimizeHeaderData,
  maximizeHeaderData,
  minimizeCallControlData,
  allMinimize,
  maximizeCallControlData,
  minimizeScreenVideoData,
  agentOperationInformation,
  peerVideoCallConnectedData,
  peerNormalCallConnectedData,
  minimizeMiniCameraScreen,
  normalMinicameraScreen,
  minimizeSplitIcon,
  normalSplitIcon,
  minimizeMiniCameraScreenInitials,
  normalMinimizeCameraScreenInitials,
  miniCameraFullName,
  normalMiniCameraFullName,
  videoMinimizeControlData
};
