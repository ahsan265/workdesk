import { agents, dataTableSettings } from './answeredData';
import { Component } from '@angular/core';

@Component({
  selector: 'app-answered',
  templateUrl: './answered.component.html',
  styleUrls: ['./answered.component.scss']
})
export class AnsweredComponent {
  dataTableSettings = dataTableSettings;
  agents = agents;
  constructor() {}
}
