import { OneSelect } from "src/app/models/oneSelect";
import { tickerModesl } from "src/app/models/preferenceModel";
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

const waitTimeData: tickerModesl = {
  mainHeading: 'Wait time',
  text: 'Set how long it takes for the Agent to respond to a request.',
  tickers: [{
    header: 'min',
    value: "0",
    min: "0",
    max: "60",
  },
  {
    header: 'sec',
    value: "30",
    min: "30",
    max: "60",
  }]
}

const userWaitTimeData: tickerModesl = {
  mainHeading: 'User wait time',
  text: 'Set how long Agent will wait for User in call.',
  tickers: [{
    header: 'min',
    value: "0",
    min: "0",
    max: "60",
  },
  {
    header: 'sec',
    value: "15",
    min: "15",
    max: "60",
  }]
}

const chatWaitTimeData: tickerModesl = {
  mainHeading: 'Chat wait time',
  text: "Set how long chat will remain inactive before it's ended automatically.",
  tickers: [{
    header: 'h',
    value: "0",
    min: "0",
    max: "24",
  }, {
    header: 'min',
    value: "0",
    min: "0",
    max: "60",
  },
  {
    header: 'sec',
    value: "15",
    min: "15",
    max: "60",
  }]
}

export {
  languauges,
  allLanguageData,
  userWaitTimeData,
  waitTimeData,
  chatWaitTimeData

}