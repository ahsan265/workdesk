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
  isAgent:boolean=false;
  agentImage!: string;
  agentLanguages: number[] = [];
  agentSettingsForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
    ]),
    first_name: new FormControl('', [
      Validators.required,
    ]),
    last_name: new FormControl('', [
      Validators.required,
    ]),
    display_name: new FormControl('', [
      Validators.required,
    ]),
  });
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private agentSettingService: AgentSettingService, private router: Router) { }

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
    this.isAgent=!event;
  }

  onGetBackButtonOutput(event: any) {
    this.router.navigate(['agents'])
  }

  onGetSaveButtonOutput(event: any) {
    console.log(event);
  }
  private async getAgentData() {
    this.selectedAgent = await this.agentSettingService.sentAgentData(this.agentId);
    this.agentSettingService.checkIsLoggedInAgent(this.selectedAgent.email);
    this.setAgentData(this.selectedAgent);
    const agentLanguages = this.agentSettingService.getLanguagesMaped(this.selectedAgent.languages);
    this.languauges = agentLanguages;
  }
  public languaugesOutput(langaugesId: number[]) {
    this.agentLanguages = langaugesId;
  }

  public updateAgentInformation() {
  }

  public setAgentData(agentData: AgentList) {
    this.agentImage = agentData.images[96];
    this.agentSettingsForm.patchValue({
      first_name: agentData?.first_name,
      last_name: agentData?.last_name,
      display_name: agentData.display_name,
    }, { emitEvent: false, onlySelf: true });

    this.switchButtonData.buttonChecked = this.agentSettingService.isAdmin(agentData.role);

  }
  updateAgentDetails() {
    const agentSetting: AgentSettings = {
      display_name: this.agentSettingsForm.controls.display_name.value,
      language_ids: this.agentLanguages,
      first_name: this.agentSettingsForm.controls.first_name.value,
      last_name: this.agentSettingsForm.controls.last_name.value,
      admin: this.isAgent,

    }
    this.agentSettingService.updateAgentSettings(agentSetting, this.agentId)
  }
}
