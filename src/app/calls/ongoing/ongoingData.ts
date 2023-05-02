import { TableSettingsModel } from "src/app/models/agent";
import { tableHeading } from "src/app/models/callModel";
import { MultiSelect } from "src/app/models/multiSelect";
import { SearchInput } from "src/app/models/searchInput";
const ongoingTableSetting: TableSettingsModel[] = [
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
    width: 12,
    showEditField: false,
    canEdit: false
  },
  {
    index: 4,
    header: 'Duration',
    defaultValue: 'Duration',
    width: 15,
    showEditField: false,
    canEdit: false
  },
  {
    index: 4,
    header: 'Agent',
    defaultValue: 'Agent',
    width: 23,
    showEditField: false,
    canEdit: false
  }
];
const callTypeOngoing: MultiSelect = {
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
const languaugesOngoing: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: [
  ]
};

export { ongoingTableSetting, callTypeOngoing, searchInputData, languaugesOngoing };
