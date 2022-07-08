/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InputData } from '@gigaaa/gigaaa-components/lib/models/input';
import { Agent } from '../models/agent';
import { agents, firstNameInput, languauges } from './agent-settingData';

@Component({
  selector: 'app-agent-settings',
  templateUrl: './agent-settings.component.html',
  styleUrls: ['./agent-settings.component.scss']
})
export class AgentSettingsComponent implements OnInit {
  agentId!: number;
  agents: Agent[] = [];
  selectedAgent: Agent | undefined;
  firstNameInput: InputData[] = firstNameInput;
  languauges = languauges;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.agentId = Number(this.activatedRoute.snapshot.params.id);
    this.getAgent();
  }

  onGetInputValue(event: any) {
    console.log(event)
  }
  getAgent(): Agent | undefined {
    this.agents = agents;
    return (this.selectedAgent = this.agents.find(
      (agent: Agent) => agent.id === this.agentId
    ));
  }
}
