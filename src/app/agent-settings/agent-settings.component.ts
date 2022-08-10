/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import {
  agentDefaultModalData,
  agentUploadImageModal,
  agents,
  backButtonData,
  cancelInvitationButtonData,
  deleteAgentButtonData,
  inputData,
  languauges,
  resendInvitationButtonData,
  saveButtonData,
  switchButtonData,
  updatePasswordModal
} from './agent-settingData';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent } from '../models/agent';
import { InputData } from '@gigaaa/gigaaa-components/lib/models/input';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgentSettingService } from './agentSettingService/agent-setting.service';
import { AgentList } from '../models/agentSocketModel';
import { AgentSettings } from '../models/agentSettingsModel';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { MessageService } from '../workdeskServices/messageService/message.service';
import { Modal } from '../models/modal';
import { UpdatePasswordComponent } from '../modals/update-password/update-password.component';

@Component({
  selector: 'app-agent-settings',
  templateUrl: './agent-settings.component.html',
  styleUrls: ['./agent-settings.component.scss']
})
export class AgentSettingsComponent implements OnInit {
  agentId!: string;
  adminAletMessage: string = '';
  agents: Agent[] = [];
  agentUploadModalData = agentUploadImageModal;
  agentDefaultModalData = agentDefaultModalData;
  passwordModalData = updatePasswordModal;
  selectedAgent!: AgentList;
  inputData: InputData[] = inputData;
  languauges = languauges;
  backButtonData = backButtonData;
  saveButtonData = saveButtonData;
  deleteAgentButtonData = deleteAgentButtonData;
  cancelInvitationData = cancelInvitationButtonData;
  resendInvitationData = resendInvitationButtonData;
  showDeleteAgentButton: boolean = false;
  showResendAndCancelButton: boolean = false;
  showPasswordSection: boolean = false;
  switchButtonData = switchButtonData;
  isAdmin: boolean = false;
  agentImage!: string;
  agentLanguages: number[] = [];
  showImageUploadModal: boolean = false;
  showPasswordModal: boolean = false;
  showDeleteAgentModal: boolean = false;
  agentSettingsForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
    ]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    display_name: new FormControl('', [Validators.required])
  });
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private agentSettingService: AgentSettingService,
    private router: Router,
    private CommonService: CommonService,
    private MessageService: MessageService
  ) {}

  ngOnInit() {
    this.authService.pageTitle.next('Settings');
    this.agentId = String(this.activatedRoute.snapshot.params.id);
    // this.getAgent();
    this.getAgentData();
  }

  onGetInputValue(event: any) {
    console.log(event);
  }
  // getAgent() {
  //   this.agents = agents;
  // }

  onGetSwitchButtonValue(event: any) {
    this.isAdmin = !event;
  }

  onGetBackButtonOutput(event: any) {
    this.router.navigate(['agents']);
  }
  onGetDeleteButtonOutput(event: any) {
    if (event) {
      this.showDeleteAgentModal = true;
    }
  }

  // for delete agent modal
  onGetSubmitButtonDeleteOutput(event: boolean) {
    if (event) {
      this.showDeleteAgentModal = false;
      this.agentSettingService.deleteAgent(this.selectedAgent.uuid);
    }
  }
  onCloseDeleteModal(event: any) {
    if (event) {
      this.showDeleteAgentModal = false;
    }
  }
  // on password submit button
  onGetSubmitButtonPasswordOutput(event: boolean) {
    if (event) {
      this.showPasswordModal = false;
    }
  }
  onCloseUpdatePasswordModal(event: any) {
    if (event) {
      this.showPasswordModal = false;
    }
  }
  // for cancel invitation and resend Initation.
  onGetCancelButtonOutput(event: boolean) {
    if (event) {
      this.agentSettingService.deleteAgent(this.selectedAgent.uuid);
    }
  }
  onGetResendInvitation(event: boolean) {
    if (event) {
      this.agentSettingService.resendInvitation(this.selectedAgent.uuid);
    }
  }
  // for password modal
  onGetPasswordButtonOutput() {
    this.showPasswordModal = true;
  }

  onGetSaveButtonOutput(event: any) {
    this.updateAgentDetails();
  }
  // for image upload

  openImageUploadButton() {
    this.showImageUploadModal = true;
  }
  onGetSubmitImageUploadOutput(event: any) {
    if (event) {
      this.showImageUploadModal = false;
    }
  }

  onCloseImageUploadbutton(event: any) {
    if (event) {
      this.showImageUploadModal = false;
    }
  }
  private async getAgentData() {
    try {
      this.selectedAgent = await this.agentSettingService.getAgentData(
        this.agentId
      );
      this.agentImage = this.selectedAgent.images[96];
      const allLanguages = await this.CommonService.getLanguages();
      const agentLanguages = this.CommonService.selectedLanguageChecket(
        allLanguages.data,
        this.selectedAgent.languages
      );
      this.languauges = agentLanguages;
      this.setAgentData(this.selectedAgent);
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
  }
  public languaugesOutput(langaugesId: number[]) {
    this.agentLanguages = langaugesId;
  }

  public setAgentData(agentData: AgentList) {
    const agentNames = this.agentSettingService.agentUserName(agentData);
    this.showResendAndCancelButton =
      this.agentSettingService.checkAgentIsInvited(agentData);
    this.agentSettingsForm.patchValue(
      {
        first_name: agentNames?.first_name,
        last_name: agentNames?.last_name,
        display_name: agentData.display_name
      },
      { emitEvent: false, onlySelf: true }
    );
    this.agentLanguages = this.CommonService.getLanguageSelectedIds(
      agentData.languages
    );
    this.adminAletMessage =
      this.agentSettingService.checkAdminOrganizationOrNomral(
        agentData.email,
        agentData.role
      );
    const isLoggedIn = this.agentSettingService.checkIsLoggedInAgent(
      agentData.email
    );
    this.isAdmin = this.agentSettingService.isAdmin(agentData.role);
    isLoggedIn === true && this.isAdmin === true
      ? (this.showDeleteAgentButton = false)
      : (this.showDeleteAgentButton = true);
    isLoggedIn === true
      ? (this.showPasswordSection = true)
      : (this.showPasswordSection = false);
    this.switchButtonData.buttonChecked = !this.isAdmin;
  }
  public updateAgentDetails() {
    const agentSetting: AgentSettings = {
      display_name: this.agentSettingsForm.controls.display_name.value,
      first_name: this.agentSettingsForm.controls.first_name.value,
      last_name: this.agentSettingsForm.controls.last_name.value,
      language_ids: this.agentLanguages,
      admin: this.isAdmin
    };
    agentSetting.first_name === '' && agentSetting.last_name === ''
      ? this.MessageService.setErrorMessage('Please fill out fields.')
      : '';
    this.agentSettingService.updateAgentSettings(agentSetting, this.agentId);
  }
}
