import { MultiSelect } from '../models/multiSelect';
import { SearchInput } from '../models/searchInput';

const languauges: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
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

const callType: MultiSelect = {
  title: 'Call type',
  showSelectAll: false,
  showSearchBar: false,
  data: [
    { id: 1, name: 'Audio', selected: false },
    { id: 2, name: 'Video', selected: false }
  ]
};

const searchInputData: SearchInput = {
  placeholder: 'search items',
  searchText: ''
};

export { languauges, callType, searchInputData };
