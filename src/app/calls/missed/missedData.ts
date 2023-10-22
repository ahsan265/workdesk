import dayjs from 'dayjs';
import { TableSettingsModel } from 'src/app/models/agent';
import { callsIndicatorData } from 'src/app/models/callIndicatorModel';
import { tableHeading } from 'src/app/models/callModel';
import { MultiSelect } from 'src/app/models/multiSelect';
import { SearchInput } from 'src/app/models/searchInput';

const missedTableSetting: TableSettingsModel[] = [
  {
    index: 0,
    header: 'User',
    defaultValue: 'User',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 1,
    header: 'User id',
    defaultValue: 'User id',
    width: 10,
    showEditField: false,
    canEdit: false
  },
  {
    index: 2,
    header: 'User Info',
    defaultValue: 'User Info',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 3,
    header: 'Request Type',
    defaultValue: 'Request Type',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 4,
    header: 'Requested at',
    defaultValue: 'Requested at',
    width: 12,
    showEditField: false,
    canEdit: false
  },
  {
    index: 5,
    header: 'Wait Time',
    defaultValue: 'Wait Time',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 6,
    header: 'Reason',
    defaultValue: 'Reason',
    width: 13,
    showEditField: false,
    canEdit: false
  }
];

const answeredTablaSetting: TableSettingsModel[] = [
  {
    index: 0,
    header: 'User',
    defaultValue: 'User',
    width: 20,
    showEditField: false,
    canEdit: false
  },
  {
    index: 1,
    header: 'User id',
    defaultValue: 'User id',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 2,
    header: 'User Info',
    defaultValue: 'User Info',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 3,
    header: 'Request Type',
    defaultValue: 'Request Type',
    width: 12,
    showEditField: false,
    canEdit: false
  },
  {
    index: 4,
    header: 'Requested At',
    defaultValue: 'Requested At',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 5,
    header: 'Agent',
    defaultValue: 'Agent',
    width: 23,
    showEditField: false,
    canEdit: false
  }
];

const paginationData: any = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 50,
  totolPages: 12
};
const missedCallData: any[] = [
  {
    call_uuid: 'dshfjdgshfjfs',
    utilites: [
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' }
    ],
    callType: { image: '../assets/images/audio.svg', text: 'Video' },
    user_id: '314165465',
    called_at: '564654',
    wait_time: '5465465',
    agent_name: 'Ahsan',
    resaon: 'call drop',
    user_details: { image: '../assets/images/user.png', text: 'Ahsan Sheikh' }
  },
  {
    call_uuid: 'dshfjdgshfjfs',
    utilites: [
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' }
    ],
    callType: { image: '../assets/images/audio.svg', text: 'Video' },
    user_id: '314165465',
    called_at: '564654',
    wait_time: '5465465',
    agent_name: 'Ahsan',
    resaon: 'call drop',
    user_details: { image: '../assets/images/user.png', text: 'Ahsan Sheikh' }
  },
  {
    call_uuid: 'dshfjdgshfjfs',
    utilites: [
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' },
      { image: '../assets/images/language_flags/english.svg' }
    ],
    callType: { image: '../assets/images/audio.svg', text: 'Video' },
    user_id: '314165465',
    called_at: '564654',
    wait_time: '5465465',
    agent_name: 'Ahsan',
    resaon: 'call drop',
    user_details: { image: '../assets/images/user.png', text: 'Ahsan Sheikh' }
  }
];
const callTypeMissed: MultiSelect = {
  title: 'Request type',
  showSelectAll: false,
  showSearchBar: false,
  data: [
    { id: 1, name: 'Audio', selected: false },
    { id: 2, name: 'Video', selected: false },
    { id: 3, name: 'Chat', selected: false }
  ]
};
const languaugesMissed: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: []
};
const searchInputData: SearchInput = {
  placeholder: 'Search by User name or Reason',
  searchText: ''
};
const missedData: callsIndicatorData = {
  hightlightText: '',
  text: 0 + ' missed requests',
  icon: '../assets/images/components/calls_count_missed.svg',
  backgroundColor: '#F9EBEF',
  borderColor: '1px solid #F4CAD6',
  textColor: '#FF155A',
  isAgent: false
};

export {
  missedTableSetting,
  missedCallData,
  answeredTablaSetting,
  callTypeMissed,
  searchInputData,
  languaugesMissed,
  paginationData,
  missedData
};
