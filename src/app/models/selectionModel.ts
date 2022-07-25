import { OneSelect } from './oneSelect';
import { SelectModelCountrySingle } from './selectionModelCountry';

export interface SelectionModel {
  selectedAll: boolean;
  item: OneSelect;
}

export interface SelectionModelCountry {
  selectedAll: boolean;
  item: SelectModelCountrySingle;
}
