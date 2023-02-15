import { MultiSelect } from "src/app/models/multiSelect";
import { SearchInput } from "src/app/models/searchInput";

const ongoingTableSetting: any = {
  tableName: 'ongoing',
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
      header: 'Request Type',
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
      header: 'Duration',
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
const callTypeOngoing: MultiSelect = {
  title: 'Request type',
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
const languaugesOngoing: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: [
  ]
};

export { ongoingTableSetting ,callTypeOngoing,searchInputData,languaugesOngoing};
