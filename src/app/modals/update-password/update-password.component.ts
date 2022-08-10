import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  passType: string = 'password';
  passType1: string = 'password';
  passType2: string = 'password';
  passtag: string = 'Show';
  passtag1: string = 'Show';
  passtag2: string = 'Show';
  srcpass1: any;
  srcpass2: any;
  srcpass3: any;
  public form!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.srcpass1 = '../../../assets/images/components/hide_icon.svg';
    this.srcpass2 = '../../../assets/images/components/hide_icon.svg';
    this.srcpass3 = '../../../assets/images/components/hide_icon.svg';
    this.form = this.fb.group({
      oldpassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      newpassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmpassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }
  changePasswordType(id: string) {
    if (id == 'current') {
      if (this.passType === 'password') {
        this.passType = 'text';
        this.passtag = 'hide';
        this.srcpass1 = '../../../assets/images/components/hide_icon.svg';
      } else {
        this.passType = 'password';
        this.passtag = 'Show';
        this.srcpass1 = '../../../assets/images/components/show_icon.svg';
      }
    } else if (id === 'new') {
      if (this.passType1 === 'password') {
        this.passType1 = 'text';
        this.passtag1 = 'hide';
        this.srcpass2 = '../../../assets/images/components/hide_icon.svg';
      } else {
        this.passType1 = 'password';
        this.passtag1 = 'Show';
        this.srcpass2 = '../../../assets/images/components/show_icon.svg';
      }
    } else if (id === 'new_current') {
      if (this.passType2 == 'password') {
        this.passType2 = 'text';
        this.passtag2 = 'hide';
        this.srcpass3 = '../../../assets/images/components/hide_icon.svg';
      } else {
        this.passType2 = 'password';
        this.passtag2 = 'Show';
        this.srcpass3 = '../../../assets/images/components/show_icon.svg';
      }
    }
  }

  public updatepasssword() {
    console.log(this.form.controls);
  }
}
