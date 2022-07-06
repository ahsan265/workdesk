/* eslint-disable no-undef */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputData } from '../../models/input';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  @Input()
  inputData!: InputData;
  @Output() sendInputValue = new EventEmitter();

  inputValue: any = '';

  constructor() {}

  onChangeInput(event: any) {
    this.sendInputValue.emit(event);
  }
}
