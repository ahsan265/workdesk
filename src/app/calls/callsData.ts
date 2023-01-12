import { MultiSelect } from '../models/multiSelect';
import { SearchInput } from '../models/searchInput';



const callType: MultiSelect = {
  title: 'Call type',
  showSelectAll: false,
  showSearchBar: false,
  data: [
    { id: 1, name: 'Audio', selected: false },
    { id: 2, name: 'Video', selected: false }
  ]
};
const languaugesIncoming: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: [
  ]
};
const languaugesMissed: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: [
  ]
};
const languaugesOngoing: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: [
  ]
};
const languaugesAnswered: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: false,
  data: [
  ]
};
const searchInputData: SearchInput = {
  placeholder: 'Search by name or user ID',
  searchText: ''
};

export { languaugesIncoming, languaugesAnswered, languaugesOngoing, languaugesMissed, callType, searchInputData };
