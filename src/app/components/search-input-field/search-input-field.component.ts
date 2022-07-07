import { Component, Input } from '@angular/core';
import { SearchInput } from 'src/app/models/searchInput';

@Component({
  selector: 'app-search-input-field',
  templateUrl: './search-input-field.component.html',
  styleUrls: ['./search-input-field.component.scss']
})
export class SearchInputFieldComponent {
  @Input() searchInputData!: SearchInput;
  constructor() {}
}
