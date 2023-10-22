import { Component, EventEmitter, Input, Output } from '@angular/core';
import { assignedAgent, unAssignedAgent } from 'src/app/models/tickets';
import {
  assignedAgentData,
  searchInputData,
  unAssignedAgentData
} from './assignData';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss']
})
export class AssignComponent {
  searchInputData = searchInputData;
  @Input() header: string = 'Assign';
  @Input() assignedAgent: assignedAgent[] = assignedAgentData;
  @Input() UnAssignedAgent: unAssignedAgent[] = unAssignedAgentData;
  @Output() assignedAgentList = new EventEmitter();

  getSearchValue(event: string) {}
}
