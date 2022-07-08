import {
  agents,
  buttonData,
  dataTableSettings,
  languauges,
  oneSelect,
  searchInputData
} from './agentsData';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {
  languauges = languauges;
  searchInputData = searchInputData;
  oneSelectData = oneSelect;
  buttonData = buttonData;
  dataTableSettings = dataTableSettings;
  agents = agents;

  constructor() {}
}
