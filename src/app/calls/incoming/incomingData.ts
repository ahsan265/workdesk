import { TableSettingsModel } from 'src/app/models/agent';
import { MultiSelect } from 'src/app/models/multiSelect';
import { SearchInput } from 'src/app/models/searchInput';
const incomingTableSetting: TableSettingsModel[] = [
  {
    index: 0,
    header: 'Queue',
    defaultValue: 'Queue',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 1,
    header: 'User',
    defaultValue: 'User',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 2,
    header: 'User id',
    defaultValue: 'User id',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 3,
    header: 'User Info',
    defaultValue: 'User Info',
    width: 20,
    showEditField: false,
    canEdit: false
  },
  {
    index: 4,
    header: 'Request  Type',
    defaultValue: 'Request  Type',
    width: 13,
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
    header: '',
    defaultValue: '',
    width: 10,
    showEditField: false,
    canEdit: false
  }
];

const callTypeIncoming: MultiSelect = {
  title: 'Request type',
  showSelectAll: false,
  showSearchBar: false,
  data: [
    { id: 1, name: 'Audio', selected: false },
    { id: 2, name: 'Video', selected: false },
    { id: 3, name: 'Chat', selected: false }
  ]
};

const searchInputData: SearchInput = {
  placeholder: 'Search by name or user ID',
  searchText: ''
};
export { incomingTableSetting, callTypeIncoming, searchInputData };
