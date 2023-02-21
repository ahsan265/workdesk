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
  { id: 1, name: 'All activity', selected: true },
  { id: 2, name: 'Active', selected: false },
  { id: 3, name: 'Invited', selected: false },
  { id: 4, name: 'Inactive', selected: false }

];

const onlineStatuses: OneSelect[] = [
  { id: 1, name: 'All status', selected: true },
  { id: 2, name: 'Online', selected: false },
  { id: 3, name: 'Away', selected: false }
];

const selectedAgentType: any[] = [
  {
    name: 'All activity',
    options: {
      active: 1,
      invited: 1,
      inactive: 1

    }
  },
  {
    name: 'Active',
    options: {
      active: 1,
      invited: 0,
      inactive: 0

    }
  },
  {
    name: 'Invited',
    options: {
      active: 0,
      invited: 1,
      inactive: 0
    }
  },
  {
    name: 'Inactive',
    options: {
      active: 0,
      invited: 0,
      inactive: 1
    }
  }
];

const searchInputData: SearchInput = {
  placeholder: 'Search by name or email...',
  searchText: ''
};

const buttonData: any = {
  active: true
};

const agentTableSetting: any = {
  tableName: 'agent',
  tableHeaders: [
    {
      index: 0,
      header: 'Agent',
      width: 30,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 1,
      header: 'Full Name',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 2,
      header: 'Language',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 3,
      header: 'Role',
      width: 10,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 4,
      header: '',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    }
  ]
};

const agents: any[] = [
  {
    id: '1',
    agent: 'srdjanmarinkovic31@gmail.com',
    name: 'Srdjan Marinkovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', '1'],
    checked: false,
    isDropdown: false,
    language_id: [
      { id: 56, image: '/assets/images/Flags/english.svg' },
      { id: 56, image: '/assets/images/Flags/english.svg' }
    ],
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
    id: '2',
    agent: 'nikola@gmail.com',
    name: 'Nikola Narancic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', '2'],
    checked: false,
    isDropdown: false,
    language_id: [
      { id: 56, image: '/assets/images/Flags/english.svg' },
      { id: 56, image: '/assets/images/Flags/english.svg' }
    ],
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
    id: '3',
    agent: 'alex@gmail.com',
    name: 'Alex Stefanovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', '3'],
    checked: false,
    isDropdown: false,
    language_id: [
      { id: 56, image: '/assets/images/Flags/english.svg' },
      { id: 56, image: '/assets/images/Flags/english.svg' }
    ],
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
    id: '4',
    agent: 'muhamed@gmail.com',
    name: 'Muhamed Ahsan',
    role: 'Admin',
    routeUrl: ['agents', 'settings', '4'],
    checked: false,
    isDropdown: false,
    language_id: [
      { id: 56, image: '/assets/images/Flags/english.svg' },
      { id: 56, image: '/assets/images/Flags/english.svg' }
    ],
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
const noAgentTobaleData = {
  'display': 'block',
  'width': '100%',
  'height': '160px',
  'background': '#fafafd',
  'border': '1px solid #e3e3eb',
  'border-top': 'none',
  'margin': '0 -1px',
  'margin-top': '1px'
}
const agentModelData = {
  title: 'Invite Human Agents',
  image: '',
  onlyOneButton: true,
  buttonOne: true,
  buttonTwo: false,
  width: '589px',
  height: '400px'
};
const agentIndicatorData = {
  hightlightText: 0 + '/' + 0,
  text: 'Agents available',
  icon: '../assets/images/components/agent_free.svg',
  backgroundColor: '#FEFEFF',
  borderColor: '1px solid #E1E1EA',
  textColor: '#737D8D',
  isAgent: true
};
export {
  languauges,
  buttonData,
  searchInputData,
  oneSelect,
  agentTableSetting,
  agents,
  selectedAgentType,
  agentModelData,
  agentIndicatorData,
  noAgentTobaleData,
  onlineStatuses
};
