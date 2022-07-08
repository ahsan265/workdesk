import { OneSelect } from './oneSelect';

export interface MultiSelect {
  title: string;
  showSelectAll: boolean;
  showSearchBar: boolean;
  data: OneSelect[];
}
