import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwitchButton } from 'src/app/models/switchButton';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss']
})
export class SwitchButtonComponent {
  @Input()
  switchButtonData!: SwitchButton;
  @Output() switchButtonValue = new EventEmitter();

  constructor() {}

  onClick() {
    this.switchButtonData.buttonChecked = !this.switchButtonData.buttonChecked;
    this.switchButtonValue.emit(this.switchButtonData.buttonChecked);
  }
}
