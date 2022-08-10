import { Component, Input, OnInit } from '@angular/core';
import { AgentList } from 'src/app/models/agentSocketModel';

@Component({
  selector: 'app-delete-agent',
  templateUrl: './delete-agent.component.html',
  styleUrls: ['./delete-agent.component.scss']
})
export class DeleteAgentComponent implements OnInit {
  @Input()
  agentData!: AgentList;
  constructor() {}

  ngOnInit(): void {
    console.log(this.agentData);
  }
}
