import { Card } from "src/app/models/card";
import { OneSelect } from "src/app/models/oneSelect";

const chatSelectionData: OneSelect[] = [{ id: 0, name: 'Calls', selected: false }, { id: 1, name: 'Chats', selected: true }
];

const chatCardsData: Card[] = [{
    icon: '../../assets/images/components/chat_incoming.svg',
    title: '',
    color: '#FFFFFF',
    mainResult: 0,
    secondResultText: '',
    secondResultNumber: 0,
    iconUp: '../../assets/images/cards/arrowUp.svg',
    iconDown: '../../assets/images/cards/arrowDown.svg'
  },
  {
    icon: '../../assets/images/components/chat_missed.svg',
    title: '',
    color: '#FFFFFF',
    mainResult: 0,
    secondResultText: '',
    secondResultNumber: 0,
    iconUp: '../../assets/images/cards/arrowUp.svg',
    iconDown: '../../assets/images/cards/arrowDown.svg'
  },
  {
    icon: '../../assets/images/components/chat_answer.svg',
    title: '',
    color: '#FFFFFF',
    mainResult: 0,
    secondResultText: '',
    secondResultNumber: 0,
    iconUp: '../../assets/images/cards/arrowUp.svg',
    iconDown: '../../assets/images/cards/arrowDown.svg'
  }];
export{
    chatSelectionData,chatCardsData
}