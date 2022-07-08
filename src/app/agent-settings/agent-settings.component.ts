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
import { ActivatedRoute } from '@angular/router';
import { Agent } from '../models/agent';
import { InputData } from '@gigaaa/gigaaa-components/lib/models/input';

@Component({
  selector: 'app-agent-settings',
  templateUrl: './agent-settings.component.html',
  styleUrls: ['./agent-settings.component.scss']
})
export class AgentSettingsComponent implements OnInit {
  agentId!: number;
  agents: Agent[] = [];
  selectedAgent: Agent | undefined;
  inputData: InputData[] = inputData;
  languauges = languauges;
  backButtonData = backButtonData;
  saveButtonData = saveButtonData;
  switchButtonData = switchButtonData;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.agentId = Number(this.activatedRoute.snapshot.params.id);
    this.getAgent();
  }

  onGetInputValue(event: any) {
    console.log(event);
  }
  getAgent(): Agent | undefined {
    this.agents = agents;
    return (this.selectedAgent = this.agents.find(
      (agent: Agent) => agent.id === this.agentId
    ));
  }

  onGetSwitchButtonValue(event: any) {
    console.log(event);
  }

  onGetBackButtonOutput(event: any) {
    console.log(event);
  }

  onGetSaveButtonOutput(event: any) {
    console.log(event);
  }
}
