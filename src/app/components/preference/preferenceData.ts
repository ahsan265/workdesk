import { MultiSelect } from "src/app/models/multiSelect";
import { SwitchButton } from "src/app/models/switchButton";

const languauges: MultiSelect = {
    title: 'Language',
    showSelectAll: false,
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
  const allLanguageData: SwitchButton = {
    firstColor: '#1C54DB',
    secondColor: '#C4C4C4',
    buttonChecked: false
  };
  export {
    languauges,
    allLanguageData
  }