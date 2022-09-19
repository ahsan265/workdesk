import { agents, dataTableSettings } from './missedData';
import { Component, Input } from '@angular/core';
import { MissedCallModel } from 'src/app/models/callModel';
import { CallsService } from '../callService/calls.service';

@Component({
  selector: 'app-missed',
  templateUrl: './missed.component.html',
  styleUrls: ['./missed.component.scss']
})
export class MissedComponent {
  dataTableSettings = dataTableSettings;
  agents = agents;
  constructor(private callservice: CallsService) {
    this.callservice.sendDataToMissedTabsSubject.pipe().subscribe((data) => {
      console.log(data);
    });
  }
}
