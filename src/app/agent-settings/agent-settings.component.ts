/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import {
  agents,
  backButtonData,
  inputData,
  languauges,
  saveButtonData,
  switchButtonData
} from './agent-settingData';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent } from '../models/agent';
import { InputData } from '@gigaaa/gigaaa-components/lib/models/input';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgentSettingService } from './agentSettingService/agent-setting.service';
import { AgentList } from '../models/agentSocketModel';
import { AgentSettings } from '../models/agentSettingsModel';
import { CommonEndpoints } from '../commonEndpoints/commonEndpoint';

@Component({
  selector: 'app-agent-settings',
  templateUrl: './agent-settings.component.html',
  styleUrls: ['./agent-settings.component.scss']
})
export class AgentSettingsComponent implements OnInit {
  agentId!: string;
  agents: Agent[] = [];
  selectedAgent: AgentList | undefined;
  inputData: InputData[] = inputData;
  languauges = languauges;
  backButtonData = backButtonData;
  saveButtonData = saveButtonData;
  switchButtonData = switchButtonData;
  isAgent: boolean = false;
  agentImage!: string;
  agentLanguages: number[] = [];
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
    private CommonEndpoints: CommonEndpoints
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.pageTitle.next('Settings');
    this.agentId = String(this.activatedRoute.snapshot.params.id);
    this.getAgent();
    this.getAgentData();
  }

  onGetInputValue(event: any) {
    console.log(event);
  }
  getAgent() {
    this.agents = agents;
  }

  onGetSwitchButtonValue(event: any) {
    this.isAgent = !event;
  }

  onGetBackButtonOutput(event: any) {
    this.router.navigate(['agents']);
  }

  onGetSaveButtonOutput(event: any) {
    this.updateAgentDetails();
  }
  private async getAgentData() {
    this.selectedAgent = await this.agentSettingService.getAgentData(
      this.agentId
    );
    this.agentImage = this.selectedAgent.images[96];
    this.agentSettingService.checkIsLoggedInAgent(this.selectedAgent.email);
    const allLanguages = await this.CommonEndpoints.getLanguages();
    const agentLanguages = this.CommonEndpoints.selectedLanguageChecket(allLanguages.data, this.selectedAgent.languages);
    this.languauges = agentLanguages;
    this.setAgentData(this.selectedAgent);
  }
  public languaugesOutput(langaugesId: number[]) {
    console.log(langaugesId)
    this.agentLanguages = langaugesId;
  }


  public setAgentData(agentData: AgentList) {
    this.agentSettingsForm.patchValue(
      {
        first_name: agentData?.first_name,
        last_name: agentData?.last_name,
        display_name: agentData.display_name
      },
      { emitEvent: false, onlySelf: true }
    );
    this.agentLanguages = this.CommonEndpoints.getLanguageSelectedIds(agentData.languages);
    this.isAgent = this.agentSettingService.isAdmin(
      agentData.role
    );
    this.switchButtonData.buttonChecked = !this.isAgent;
  }
  public updateAgentDetails() {
    const agentSetting: AgentSettings = {
      display_name: this.agentSettingsForm.controls.display_name.value,
      language_ids: this.agentLanguages,
      first_name: this.agentSettingsForm.controls.first_name.value,
      last_name: this.agentSettingsForm.controls.last_name.value,
      admin: this.isAgent
    };
    this.agentSettingService.updateAgentSettings(agentSetting, this.agentId);
  }
}
