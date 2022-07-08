import { Button } from '../models/button';
import { InputData } from '../models/input';
import { MultiSelect } from '../models/multiSelect';
import { SwitchButton } from '../models/switchButton';

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
  data: [
    { id: 1, name: 'Arabic', selected: false },
    { id: 2, name: 'English', selected: false },
    { id: 3, name: 'German', selected: false },
    { id: 4, name: 'Russian', selected: false },
    { id: 5, name: 'Spanish', selected: false },
    { id: 6, name: 'Turkish', selected: false },
    { id: 7, name: 'Urdu', selected: false }
  ]
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

const switchButtonData: SwitchButton = {
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
  switchButtonData
};
