import { tableSettings } from 'src/app/models/callModel';
import { MultiSelect } from 'src/app/models/multiSelect';
import { SearchInput } from 'src/app/models/searchInput';

const missedTableSetting: tableSettings = {
  tableName: 'missed',
  tableHeaders: [
    {
      index: 0,
      header: 'User',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 1,
      header: 'User id',
      width: 10,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 2,
      header: 'User Info',
      width: 15,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 3,
      header: 'Call Type',
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
      header: 'Called at',
      width: 15,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 4,
      header: 'Wait Time',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 4,
      header: 'Reason',
      width: 10,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    }
  ]
};
const answeredTablaSetting: tableSettings = {
  tableName: 'answered',
  tableHeaders: [
    {
      index: 0,
      header: 'User',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 1,
      header: 'User id',
      width: 15,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 2,
      header: 'User Info',
      width: 15,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 3,
      header: 'Call Type',
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
      header: 'Called At',
      width: 15,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 4,
      header: 'Agent',
      width: 25,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    }
  ]
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
  title: 'Call type',
  showSelectAll: false,
  showSearchBar: false,
  data: [
    { id: 1, name: 'Audio', selected: false },
    { id: 2, name: 'Video', selected: false }
  ]
};

const searchInputData: SearchInput = {
  placeholder: 'Search by name or user ID',
  searchText: ''
};
export { missedTableSetting, missedCallData, answeredTablaSetting, callTypeMissed, searchInputData };
