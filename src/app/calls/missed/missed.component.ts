import { agents, dataTableSettings } from './missedData';
import { Component } from '@angular/core';

@Component({
  selector: 'app-missed',
  templateUrl: './missed.component.html',
  styleUrls: ['./missed.component.scss']
})
export class MissedComponent {
  dataTableSettings = dataTableSettings;
  agents = agents;
  constructor() {}
}
