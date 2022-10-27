import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AgentSettingService } from 'src/app/agent-settings/agentSettingService/agent-setting.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

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
  constructor(private FormBuilder: FormBuilder,
    private MessageService: MessageService,
    private AgentSettingService: AgentSettingService,
    private SharedServices: SharedServices) { }

  ngOnInit(): void {
    this.srcpass1 = '../../../assets/images/components/hide_icon.svg';
    this.srcpass2 = '../../../assets/images/components/hide_icon.svg';
    this.srcpass3 = '../../../assets/images/components/hide_icon.svg';
    this.form = this.FormBuilder.group({
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


  public async updatepasssword(): Promise<void> {
    try {
      if (this.form.get('oldpassword')?.invalid) {
        this.MessageService.setErrorMessage("Current Password field is required")
      }
      else if (this.form.get('newpassword')?.invalid) {
        this.MessageService.setErrorMessage("New Password field  is required")
      }
      else if (this.form.get('confirmpassword')?.invalid) {
        this.MessageService.setErrorMessage("Confirm New Password")
      }
      else if (this.form.get('newpassword')?.value != this.form.get('confirmpassword')?.value) {
        this.MessageService.setErrorMessage("Please make sure your passwords match")
      }
      else if (this.form.get('oldpassword')?.value == this.form.get('newpassword')?.value || this.form.get('confirmpassword')?.value) {
        this.MessageService.setErrorMessage("New password cannot be the same as current password")

      }
      else {
        const user = JSON.parse(localStorage.getItem('gigaaa-user') || '{}');
        var data = { "password_old": this.form.value.oldpassword, "password": this.form.value.newpassword, "password_confirmation": this.form.value.confirmpassword }
        await this.AgentSettingService.UpdatePassword(data, user.id);
        this.SharedServices.closePasswordPopup(true);
      }
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.message);
    }
  }

  closethepassWordPopup() {
    this.SharedServices.closePasswordPopup(true)
  }
}
