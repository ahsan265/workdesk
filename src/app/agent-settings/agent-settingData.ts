import { Button } from '../models/button';
import { InputData } from '../models/input';
import { Modal } from '../models/modal';
import { MultiSelect } from '../models/multiSelect';
import { SwitchButton } from '../models/switchButton';
const agentDefaultModalData: Modal = {
  title: 'Are you sure you want to delete this agent?',
  // image: '../assets/images/sidebar/agents.svg',
  onlyOneButton: false,
  buttonOne: {
    title: 'Cancel',
    backgroundColor: 'white',
    borderColor: '1px solid rgba(208,208,222,.6)',
    textColor: '#162741',
    active: true
  },
  buttonTwo: {
    title: 'Delete agent',
    backgroundColor: '#1C54DB',
    borderColor: 'none',
    textColor: 'white',
    active: true
  },
  width: '594px',
  height: '250px'
};

const agentUploadImageModal: Modal = {
  title: 'Upload photo',
  // image: '../assets/images/sidebar/agents.svg',
  onlyOneButton: false,
  buttonOne: {
    title: 'Cancel',
    backgroundColor: 'white',
    borderColor: '1px solid rgba(208,208,222,.6)',
    textColor: '#162741',
    active: true
  },
  buttonTwo: {
    title: 'Change',
    backgroundColor: '#1C54DB',
    borderColor: 'none',
    textColor: 'white',
    active: true
  },
  width: '594px',
  height: 'fit-content'
};
const updatePasswordModal: Modal = {
  title: 'Reset password',
  // image: '../assets/images/sidebar/agents.svg',
  onlyOneButton: false,
  buttonOne: {
    title: 'Cancel',
    backgroundColor: 'white',
    borderColor: '1px solid rgba(208,208,222,.6)',
    textColor: '#162741',
    active: true
  },
  buttonTwo: {
    title: 'Upload',
    backgroundColor: '#1C54DB',
    borderColor: 'none',
    textColor: 'white',
    active: true
  },
  width: '302px',
  height: '413px'
};
const agents = [
  {
    id: 1,
    agent: 'srdjanmarinkovic31@gmail.com',
    name: 'Srdjan Marinkovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 1],
    checked: false,
    isDropdown: false,
    language_id: [56, 175]
  },
  {
    id: 2,
    agent: 'nikola@gmail.com',
    name: 'Nikola Narancic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 2],
    checked: false,
    isDropdown: false,
    language_id: [56]
  },
  {
    id: 3,
    agent: 'alex@gmail.com',
    name: 'Alex Stefanovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 3],
    checked: false,
    isDropdown: false,
    language_id: [56, 83]
  },
  {
    id: 4,
    agent: 'muhamed@gmail.com',
    name: 'Muhamed Ahsan',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 4],
    checked: false,
    isDropdown: false,
    language_id: [56, 175]
  }
];

const languauges: MultiSelect = {
  title: 'Language',
  showSelectAll: false,
  showSearchBar: false,
  data: []
};

const inputData: InputData[] = [
  {
    value: '',
    placeholder: 'First Name',
    fieldName: 'firstName'
  },
  {
    value: '',
    placeholder: 'Last Name',
    fieldName: 'lastName'
  },
  {
    value: '',
    placeholder: 'Agent Name',
    fieldName: 'agentName'
  }
];

const backButtonData: Button = {
  title: 'Back',
  // icon: '../assets/images/sidebar/agents.svg',
  backgroundColor: '#EFEFEF',
  borderColor: '#C3C7CC',
  textColor: '#162741',
  active: true
};

const saveButtonData: Button = {
  title: 'Save',
  // icon: '../assets/images/sidebar/agents.svg',
  backgroundColor: '#1C54DB',
  borderColor: 'none',
  textColor: 'white',
  active: true
};

const deleteAgentButtonData: Button = {
  title: 'Delete agent',
  icon: '../assets/images/components/deleteicon.svg',
  backgroundColor: '#FFFFFF',
  borderColor: '1px solid rgba(208,208,222,.6)',
  textColor: '#162741',
  active: true
};

const resendInvitationButtonData: Button = {
  title: 'Resend Invitation',
  // icon: '../assets/images/components/deleteicon.svg',
  backgroundColor: '#FFFFFF',
  borderColor: '1px solid rgba(208,208,222,.6)',
  textColor: '#162741',
  active: true
};
const cancelInvitationButtonData: Button = {
  title: 'Cancel Invitation',
  // icon: '../assets/images/delete.svg',
  backgroundColor: '#FFFFFF',
  borderColor: '1px solid rgba(208,208,222,.6)',
  textColor: '#162741',
  active: true
};
const switchButtonData: SwitchButton = {
  firstColor: '#1C54DB',
  secondColor: '#C4C4C4',
  buttonChecked: false
};

const allLanguageData: SwitchButton = {
  firstColor: '#1C54DB',
  secondColor: '#C4C4C4',
  buttonChecked: false
};
export {
  agents,
  inputData,
  languauges,
  backButtonData,
  saveButtonData,
  switchButtonData,
  allLanguageData,
  deleteAgentButtonData,
  resendInvitationButtonData,
  cancelInvitationButtonData,
  agentDefaultModalData,
  updatePasswordModal,
  agentUploadImageModal
};
