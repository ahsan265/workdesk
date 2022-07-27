import * as dayjs from 'dayjs';
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
  title: '',
  color: '#FFFFFF',
  mainResult: '0',
  secondResultText: '',
  secondResultNumber: 0,
  iconUp: '../../assets/images/cards/arrowUp.svg',
  iconDown: '../../assets/images/cards/arrowDown.svg'
};
const ranges: any = {
  Today: [dayjs(), dayjs()],
  Yesterday: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
  'This week': [
    dayjs().startOf('week').add(1, 'day'),
    dayjs().endOf('week').add(1, 'day')
  ],
  'Last week': [
    dayjs().subtract(1, 'week').startOf('week').add(1, 'day'),
    dayjs().subtract(1, 'week').endOf('week').add(1, 'day')
  ],
  'This month': [dayjs().startOf('month'), dayjs().endOf('month')],
  'Last month': [
    dayjs().subtract(1, 'month').startOf('month'),
    dayjs().subtract(1, 'month').endOf('month')
  ],
  'This year': [dayjs().startOf('year'), dayjs().endOf('year')],
  'Last year': [
    dayjs().subtract(1, 'year').startOf('year'),
    dayjs().subtract(1, 'year').endOf('year')
  ]
};


export { oneSelectData, countries, languauges, cardDataTotalVisitors ,ranges};
