import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { EMPTY } from 'rxjs';
import { MultiSelect } from 'src/app/models/multiSelect';
import { OneSelect } from 'src/app/models/oneSelect';
import { SearchInput } from 'src/app/models/searchInput';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent {
  @ViewChild('dropdown') dropdown: any = HTMLElement;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.dropdown?.nativeElement.contains(event?.target)) {
      this.showDropdown = false;
    }
  }
  @Input() multiSelectData!: MultiSelect;
  @Output() multiSelectOutput = new EventEmitter();
  showDropdown: boolean = false;
  selectedItem!: OneSelect;
  selectedAll: boolean = false;

  searchInputData: SearchInput = {
    placeholder: 'search',
    searchText: ''
  };

  constructor() {}

  onOpenDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onChooseItem(choosenItem: OneSelect) {
    this.multiSelectData.data.map((item: OneSelect) => {
      item.id === choosenItem.id
        ? ((item.selected = !item.selected), (this.selectedItem = item))
        : EMPTY;
    });
    this.multiSelectOutput.emit(this.selectedItem);
    this.selectedAll = this.multiSelectData.data.every(
      (item: OneSelect) => item.selected
    );
  }

  onSelectAll() {
    this.selectedAll = !this.selectedAll;
    this.multiSelectData.data.map((item: OneSelect) => {
      this.selectedAll ? (item.selected = true) : (item.selected = false);
    });
  }

  onClear() {
    this.selectedAll = false;
    this.multiSelectData.data.map((item: OneSelect) => (item.selected = false));
  }
}
