import * as dayjs from 'dayjs';
import { Card } from '../models/card';
import { MultiSelect } from '../models/multiSelect';
import { OneSelect } from '../models/oneSelect';

const oneSelectData: OneSelect[] = [{ id: 1, name: 'Calls', selected: true }, { id: 1, name: 'Chats', selected: false }
];

const countries: MultiSelect = {
  title: 'Location',
  showSelectAll: true,
  showSearchBar: true,
  data: [

  ]
};

const languauges: MultiSelect = {
  title: 'Language',
  showSelectAll: true,
  showSearchBar: true,
  data: []
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

export { oneSelectData, countries, languauges, cardDataTotalVisitors, ranges };
