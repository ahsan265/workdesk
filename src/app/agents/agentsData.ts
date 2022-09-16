import { Button } from '../models/button';
import { MultiSelect } from '../models/multiSelect';
import { OneSelect } from '../models/oneSelect';
import { SearchInput } from '../models/searchInput';

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

const oneSelect: OneSelect[] = [
  { id: 1, name: 'Show all', selected: true },
  { id: 2, name: 'Active', selected: false },
  { id: 3, name: 'Inactive', selected: false },
  { id: 4, name: 'Invited', selected: false }
];

const selectedAgentType: any[] = [
  {
    name: 'Show all',
    options: {
      active: 1,
      inactive: 1,
      invited: 1
    }
  },
  {
    name: 'Active',
    options: {
      active: 1,
      inactive: 0,
      invited: 0
    }
  },
  {
    name: 'Inactive',
    options: {
      active: 0,
      inactive: 1,
      invited: 0
    }
  },
  {
    name: 'Invited',
    options: {
      active: 0,
      inactive: 0,
      invited: 1
    }
  }
];

const searchInputData: SearchInput = {
  placeholder: 'search items',
  searchText: ''
};

const buttonData: Button = {
  title: '+ Add agent',
  // icon: '../assets/images/sidebar/agents.svg',
  backgroundColor: '#1C54DB',
  borderColor: 'none',
  textColor: 'white',
  active: true
};

const dataTableSettings: any[] = [
  {
    primaryKey: 'checkmark',
    header: '',
    width: 10,
    isImage: false,
    name: true,
    isDropdown: false,
    canEdit: false,
    expand: false,
    editIcon: false,
    checkmark: true,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'agent',
    header: 'AGENT',
    width: 25,
    isImage: false,
    name: false,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: true
  },
  {
    primaryKey: 'name',
    header: 'FULL NAME',
    width: 25,
    isImage: false,
    name: true,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'language_id',
    header: 'LANGUAGE',
    width: 25,
    isImage: true,
    name: false,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'role',
    header: 'ROLE',
    width: 25,
    isImage: false,
    name: false,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'buttons',
    header: '',
    width: 15,
    isImage: false,
    name: false,
    isDropdown: false,
    canEdit: true,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  }
];

const agents = [
  {
    id: 1,
    agent: 'srdjanmarinkovic31@gmail.com',
    name: 'Srdjan Marinkovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 1],
    checked: false,
    isDropdown: false,
    language_id: [56, 175],
    editIcon: true,
    canEdit: true,
    invitation_accepted: true,
    checkmark: true,
    userItem: {
      text: 'video',
      image: '../../../assets/images/callInterface/user.png',
      color: '#3EDE26'
    }
  },
  {
    id: 2,
    agent: 'nikola@gmail.com',
    name: 'Nikola Narancic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 2],
    checked: false,
    isDropdown: false,
    language_id: [56],
    editIcon: true,
    canEdit: true,
    invitation_accepted: true,
    checkmark: false,
    userItem: {
      text: 'video',
      image: '../../../assets/images/callInterface/user.png',
      color: '#FF155A'
    }
  },
  {
    id: 3,
    agent: 'alex@gmail.com',
    name: 'Alex Stefanovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 3],
    checked: false,
    isDropdown: false,
    language_id: [56, 83],
    editIcon: true,
    canEdit: true,
    invitation_accepted: true,
    checkmark: false,
    userItem: {
      text: 'video',
      image: '../../../assets/images/callInterface/user.png',
      color: '#FF155A'
    }
  },
  {
    id: 4,
    agent: 'muhamed@gmail.com',
    name: 'Muhamed Ahsan',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 4],
    checked: false,
    isDropdown: false,
    language_id: [56, 175],
    editIcon: true,
    canEdit: true,
    invitation_accepted: false,
    checkmark: false,
    userItem: {
      text: 'video',
      image: '../../../assets/images/callInterface/user.png',
      color: '#FF155A'
    }
  }
];

const agentModelData = {
  title: 'INVITE HUMAN AGENT',
  image: '',
  onlyOneButton: true,
  buttonOne: true,
  buttonTwo: false,
  width: '600px',
  height: '600px'
};
export {
  languauges,
  buttonData,
  searchInputData,
  oneSelect,
  dataTableSettings,
  agents,
  selectedAgentType,
  agentModelData
};
