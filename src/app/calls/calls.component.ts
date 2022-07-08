import { Component, OnInit } from '@angular/core';
import { callType, languauges, searchInputData } from './callsData';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  callType = callType;
  languauges = languauges;
  searchInputData = searchInputData;
  constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
