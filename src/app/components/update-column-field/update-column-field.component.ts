import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-column-field',
  templateUrl: './update-column-field.component.html',
  styleUrls: ['./update-column-field.component.scss']
})
export class UpdateColumnFieldComponent {
  @Input() headerValue: any = '';
  @Output() updatedField = new EventEmitter<any>();
  textFieldForm = new FormGroup({
    textField: new FormControl('', [Validators.required])
  });
  @Input() openEditFiedl: boolean = false;

  constructor() {
    this.textFieldForm.patchValue({
      textField: this.headerValue
    })
  }

  updateField() {
    if (this.textFieldForm.controls.textField.value !== '' && this.textFieldForm.controls.textField.value !== null) {
      const data = {
        value: this.textFieldForm.controls.textField.value,
        headerInformation: this.headerValue
      }
      this.updatedField.emit(data)
      this.textFieldForm.patchValue({
        textField: ''
      })
    }
    else {
      const data = {
        value: this.textFieldForm.controls.textField.value,
        headerInformation: this.headerValue
      }
      this.updatedField.emit(data)
    }

  }

  // close the field()
  closeFieldBox(event: boolean) {
    // if (event !== true) {
    //   const data = {
    //     value: this.textFieldForm.controls.textField.value,
    //     headerInformation: this.headerValue
    //   }
    //   this.updatedField.emit(data)
    // }
  }

}
