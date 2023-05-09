import { OneSelect } from "src/app/models/oneSelect";
import { tickerModel } from "src/app/models/preferenceModel";
import { RequestTimeModel } from "src/app/models/settings";
import { SwitchButton } from "src/app/models/switchButton";

const languauges: OneSelect[] =
  [
    { id: 1, name: 'English', selected: true },
  ]

const allLanguageData: SwitchButton = {
  firstColor: '#1C54DB',
  secondColor: '#C4C4C4',
  buttonChecked: false
};

const waitTimeData: tickerModel = {
  name: 'call',
  mainHeading: 'Wait time',
  text: 'Set how long it takes for the Agent to respond to a request.',
  tickers: [{
    header: 'min',
    value: 0,
    min: 0,
    max: 60,
  },
  {
    header: 'sec',
    value: 30,
    min: 0,
    max: 60,
  }]
}

const userWaitTimeData: tickerModel = {
  name: 'user',
  mainHeading: 'User wait time',
  text: 'Set how long Agent will wait for User in call.',
  tickers: [{
    header: 'min',
    value: 0,
    min: 0,
    max: 60,
  },
  {
    header: 'sec',
    value: 15,
    min: 0,
    max: 60,
  }]
}

const chatWaitTimeData: tickerModel = {
  name: 'chat',
  mainHeading: 'Chat wait time',
  text: "Set how long chat will remain inactive before it's ended automatically.",
  tickers: [{
    header: 'h',
    value: 0,
    min: 0,
    max: 23,
  }, {
    header: 'min',
    value: 0,
    min: 0,
    max: 60,
  },
  {
    header: 'sec',
    value: 0,
    min: 0,
    max: 60,
  }]
}

const DefaultTimeDataResponse: RequestTimeModel = {
  call_wait_time: 15,
  chat_wait_time: 15,
  user_wait_time: 15
}
export {
  languauges,
  allLanguageData,
  userWaitTimeData,
  waitTimeData,
  chatWaitTimeData,
  DefaultTimeDataResponse
}