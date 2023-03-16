import { MultiSelect } from "src/app/models/multiSelect";
import { OneSelect } from "src/app/models/oneSelect";
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
export {
  languauges,
  allLanguageData
}