import dayjs from "dayjs";
import { Button } from "../models/button";
import { OneSelect } from "../models/oneSelect";

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
const oneSelectData: OneSelect[] = [{ id: 1, name: 'Calls', selected: true }, { id: 1, name: 'Chats', selected: false }
];
const backButtonData: Button = {
  title: 'Cancel',
  // icon: '../assets/images/sidebar/agents.svg',
  backgroundColor: '#FFFFFF',
  borderColor: '1px solid #E1E1EA',
  textColor: '#162741',
  active: true
};
const priorityData: OneSelect[] = [
  { id: 0, name: 'Urgent', selected: true },
  { id: 1, name: 'High', selected: false },
  { id: 2, name: 'Normal', selected: false },
  { id: 3, name: 'Low', selected: false }];

const statusType: OneSelect[] = [{
  id: 0,
  name: 'Done',
  selected: false
},
{
  id: 1,
  name: 'In progress',
  selected: false
},
{
  id: 2,
  name: 'Not started',
  selected: false
}]

export {
  ranges, oneSelectData, backButtonData, priorityData, statusType
}