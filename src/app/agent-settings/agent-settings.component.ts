/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import {
  agentDefaultModalData,
  agentUploadImageModal,
  allLanguageData,
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
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgentSettingService } from './agentSettingService/agent-setting.service';
import { AgentList } from '../models/agentSocketModel';
import { AgentSettings } from '../models/agentSettingsModel';
import { CommonService } from '../workdeskServices/commonEndpoint/common.service';
import { MessageService } from '../workdeskServices/messageService/message.service';
import { AgentService } from '../agents/agentService/agent.service';
import { SharedServices } from '../workdeskServices/sharedResourcesService/shared-resource-service.service';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { UploadImageComponent } from '../modals/upload-image/upload-image.component';
import { DeleteAgentComponent } from '../modals/delete-agent/delete-agent.component';

@Component({
  selector: 'app-agent-settings',
  templateUrl: './agent-settings.component.html',
  styleUrls: ['./agent-settings.component.scss']
})
export class AgentSettingsComponent implements OnInit {
  agentId!: string;
  adminAletMessage: string = '';
  pendingStatusForLanguages: string = '';
  pendingStatusForAdminRights: string = '';
  agents: Agent[] = [];
  agentUploadModalData = agentUploadImageModal;
  agentDefaultModalData = agentDefaultModalData;
  passwordModalData = updatePasswordModal;
  selectedAgent!: AgentList;
  inputData: any[] = inputData;
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
  allLanguageData = allLanguageData;
  isAdmin: boolean = false;
  agentImage!: string;
  agentLanguages: number[] = [];
  showImageUploadModal: boolean = false;
  showPasswordModal: boolean = false;
  showDeleteAgentModal: boolean = false;
  disableAgentRights: boolean = false;
  isDropdownEnabled: boolean = true;
  isButtonDisabled: boolean = false;
  isAllLanguageSelected: boolean = false;
  showAllSelectedLanguageToggle: boolean = false;
  showAdminRightSection: boolean = true;
  showImageRemove: boolean = false
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
    private MessageService: MessageService,
    private AgentService: AgentService,
    private SharedServices: SharedServices,
    private OverlayService: OverlayService
  ) { }

  ngOnInit() {
    this.authService.pageTitle.next('Agent Settings');
    this.agentId = String(this.activatedRoute.snapshot.params.id);
    this.getAgentData();
    // for closing image upload popup
    this.SharedServices.closeImageUploadDialog.subscribe((data: boolean) => {
      this.showImageUploadModal = data;
    });
    // for setting latest updated image

    this.SharedServices.setAgentImage.subscribe((data: string) => {
      let timestamp = new Date().getTime();
      this.agentImage = data + '?_=' + timestamp;
      this.showImageRemove = true;
    });

    // closing passwordpopup
    this.SharedServices.PasswordPopup.subscribe((data) => {
      if (data) {
        this.showPasswordModal = false;
        this.showDeleteAgentModal = false;
      }
    });
  }

  onGetInputValue(event: any) {
  }
  // to get is Admin or not 
  onGetSwitchButtonValue(event: any) {
    this.isAdmin = !event;
  }
  onGetSwitchAllLanguage(event: any) {
    this.isAllLanguageSelected = event;
    this.agentSettingService.setAllLanguageEnabled(this.selectedAgent.uuid, {
      all_languages: !this.isAllLanguageSelected
    });
  }

  onGetBackButtonOutput(event: any) {
    this.router.navigate(['agents']);
  }
  onGetDeleteButtonOutput(event: any) {
    this.OverlayService.open({
      component: DeleteAgentComponent,
      data: this.selectedAgent,
      isPopup: true,
      hasBackdrop: true,
      panelClass: 'deleteAgent'
    })
  }

  // for delete agent modal
  onGetSubmitButtonDeleteOutput(event: boolean) {
    if (event) {
      this.showDeleteAgentModal = false;
      this.agentSettingService.deleteAgent(
        this.selectedAgent.uuid,
        'Agent deleted successfully.'
      );
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
      this.agentSettingService.deleteAgent(
        this.selectedAgent.uuid,
        'Agent invitation has been canceled.'
      );
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
    this.OverlayService.open({
      component: UploadImageComponent,
      data: this.selectedAgent,
      panelClass: 'imagePopup',
      hasBackdrop: true,
      backdropClass: 'dark-backdrop'
    })
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
      this.setAgentData(this.selectedAgent);
      this.agentImage = this.selectedAgent.images[96];
      const allLanguages = await this.CommonService.getProjectLanguages();
      const agentLanguages = this.CommonService.selectedLanguageChecket(
        allLanguages.data,
        this.selectedAgent.languages
      );
      this.languauges = agentLanguages;
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
    (this.selectedAgent.is_image_set) ? this.showImageRemove = true : this.showImageRemove = false;
    this.selectedAgent.is_organization_admin === true
      ? (this.showAllSelectedLanguageToggle = true)
      : (this.showAllSelectedLanguageToggle = false);
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
        first_name: agentData?.first_name,
        last_name: agentData?.last_name,
        display_name: agentData?.display_name
      },
      { emitEvent: false, onlySelf: true }
    );
    this.agentLanguages = this.CommonService.getLanguageSelectedIds(
      agentData.languages
    );
    this.adminAletMessage =
      this.agentSettingService.checkAdminOrganizationOrNomral(
        agentData.is_organization_admin,
        agentData.role
      );

    const isLoggedIn = this.AgentService.checkIsLoggedInAgent(agentData.email);
    if (isLoggedIn === true) {
      agentData.is_organization_owner === true
        ? (this.showAdminRightSection = false)
        : (this.showAdminRightSection = true);
    }
    this.isAdmin = this.agentSettingService.isAdmin(agentData.role);
    const isAgentAcceptInvitation = this.AgentService.setAgentInvitedProperty(
      agentData.invited,
      agentData.inactive,
      agentData.active
    );

    if (isAgentAcceptInvitation === false) {
      this.agentSettingsForm.controls['first_name'].disable();
      this.agentSettingsForm.controls['last_name'].disable();
      this.agentSettingsForm.controls['display_name'].disable();
    }
    if (isLoggedIn === true && this.isAdmin === true) {
      this.showDeleteAgentButton = false;
    } else if (isAgentAcceptInvitation === true) {
      this.showDeleteAgentButton = true;
    } else if (isAgentAcceptInvitation === false) {
      this.isDropdownEnabled = false;
      this.isButtonDisabled = true;
    }

    this.pendingStatusForLanguages =
      this.agentSettingService.checkAgentStatusIsPendingLanguage(
        isAgentAcceptInvitation
      );
    this.pendingStatusForAdminRights =
      this.agentSettingService.checkAgentStatusIsPendingAdminRights(
        isAgentAcceptInvitation
      );
    isLoggedIn === true
      ? (this.showPasswordSection = true)
      : (this.showPasswordSection = false);
    this.switchButtonData.buttonChecked = !this.isAdmin;
    this.allLanguageData.buttonChecked = !agentData.all_call_requests;
  }
  public updateAgentDetails() {
    const agentSetting: AgentSettings = {
      display_name: this.agentSettingsForm.controls?.display_name.value,
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

  // set remove picture
  async removeImage() {
    const defaultImage = await this.agentSettingService.removeAgentImage(this.selectedAgent.uuid);
    this.agentImage = defaultImage[96];
    this.showImageRemove = false;

  }
}
