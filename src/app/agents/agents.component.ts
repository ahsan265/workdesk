/* eslint-disable no-unused-vars */
import {
  agents,
  buttonData,
  dataTableSettings,
  languauges,
  oneSelect,
  searchInputData
} from './agentsData';
import { AuthService } from '../services/auth.service';
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

  constructor(private authService: AuthService) {
    this.authService.pageTitle.next('Agents');
  }
}
