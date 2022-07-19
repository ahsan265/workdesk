import { Card } from '../models/card';
import { MultiSelect } from '../models/multiSelect';
import { OneSelect } from '../models/oneSelect';

const oneSelectData: OneSelect[] = [{ id: 1, name: 'Calls', selected: true }];

const countries: MultiSelect = {
  title: 'Location',
  showSelectAll: true,
  showSearchBar: true,
  data: [
    { id: 1, name: 'Show all', selected: false },
    { id: 2, name: 'Active', selected: false },
    { id: 3, name: 'Inactive', selected: false },
    { id: 4, name: 'Invited', selected: false },
    { id: 5, name: 'Inactive', selected: false },
    { id: 6, name: 'Inactive', selected: false },
    { id: 7, name: 'Inactive', selected: false },
    { id: 8, name: 'Inactive', selected: false },
    { id: 9, name: 'Inactive', selected: false },
    { id: 10, name: 'Inactive', selected: false },
    { id: 11, name: 'Inactive', selected: false },
    { id: 12, name: 'Inactive', selected: false },
    { id: 13, name: 'Inactive', selected: false },
    { id: 14, name: 'Inactive', selected: false },
    { id: 15, name: 'Inactive', selected: false },
    { id: 16, name: 'Inactive', selected: false },
    { id: 17, name: 'Inactive', selected: false },
    { id: 18, name: 'Inactive', selected: false },
    { id: 19, name: 'Inactive', selected: false }
  ]
};

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

const cardDataTotalVisitors: Card = {
  icon: '../../assets/images/dropdown/checkmart_white.svg',
  title: 'Total Visitors',
  color: '#EDEDF6',
  mainResult: '15',
  secondResultText: '%',
  secondResultNumber:-123,
  iconUp: '../../assets/images/cards/arrowUp.svg',
  iconDown: '../../assets/images/cards/arrowDown.svg'
};

export { oneSelectData, countries, languauges, cardDataTotalVisitors };
