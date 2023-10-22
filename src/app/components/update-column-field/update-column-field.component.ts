import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableSettingsModel } from 'src/app/models/agent';

@Component({
  selector: 'app-update-column-field',
  templateUrl: './update-column-field.component.html',
  styleUrls: ['./update-column-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateColumnFieldComponent implements OnInit {
  @Input() headerValue!: TableSettingsModel;
  @Input() characterLimit: number = 12;
  @Output() updatedField = new EventEmitter<any>();
  textFieldForm = new FormGroup({
    textField: new FormControl('', [Validators.required])
  });
  counter: number = 0;
  @Input() openEditFiedl: boolean = false;

  constructor() {}
  ngOnInit(): void {
    this.textFieldForm.patchValue({
      textField: this.headerValue.header
    });
  }

  updateField() {
    if (
      this.textFieldForm.controls.textField.value !== '' &&
      this.textFieldForm.controls.textField.value !== null
    ) {
      const data = {
        value: this.textFieldForm.controls.textField.value,
        headerInformation: this.headerValue
      };
      this.updatedField.emit(data);
    } else {
      const data = {
        value: this.textFieldForm.controls.textField.value,
        headerInformation: this.headerValue
      };
      this.textFieldForm.patchValue({
        textField: this.headerValue.header
      });
      this.updatedField.emit(data);
    }
  }

  // close the field()
  closeFieldBox(event: boolean) {
    if (event === false) {
      this.updateField();
    }
  }
}
