/* eslint-disable no-undef */
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { OneSelect } from 'src/app/models/oneSelect';

@Component({
  selector: 'app-one-select-dropdown',
  templateUrl: './one-select-dropdown.component.html',
  styleUrls: ['./one-select-dropdown.component.scss']
})
export class OneSelectDropdownComponent implements OnInit {
  @ViewChild('dropdown') dropdown: any = HTMLElement;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.dropdown?.nativeElement.contains(event?.target)) {
      this.showDropdown = false;
    }
  }
  @Input() oneSelectData: any;
  @Output() oneSelectOutput = new EventEmitter();
  showDropdown: boolean = false;
  selectedItem!: OneSelect;

  constructor() {}

  ngOnInit() {
    this.selectedItem = this.oneSelectData.find((item: any) => item.selected);
  }

  onOpenDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onChooseItem(choosenItem: OneSelect) {
    this.oneSelectData.map((item: OneSelect) => {
      item.id === choosenItem.id
        ? ((item.selected = true), (this.selectedItem = item))
        : (item.selected = false);
    });
    this.oneSelectOutput.emit(this.selectedItem);
    this.showDropdown = false;
  }
}
