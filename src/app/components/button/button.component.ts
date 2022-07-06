import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonData: any;
  @Output() buttonOutput = new EventEmitter();

  buttonIsDisabled: boolean = false;

  constructor() {}

  onClick() {
    this.buttonOutput.emit(true);
  }
}
