import { tableSettings } from 'src/app/models/callModel';
import { MultiSelect } from 'src/app/models/multiSelect';
import { SearchInput } from 'src/app/models/searchInput';

const incomingTableSetting: tableSettings = {
  tableName: 'incoming',
  tableHeaders: [
    {
      index: 0,
      header: 'Queue',
      width: 10,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 1,
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
      index: 2,
      header: 'User id',
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
      header: 'User Info',
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
      header: 'Wait Time',
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

const callTypeIncoming: MultiSelect = {
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
export { incomingTableSetting, callTypeIncoming, searchInputData };
