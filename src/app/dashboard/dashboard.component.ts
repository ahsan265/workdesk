/* eslint-disable no-undef */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Button } from '../models/button';
import { Card } from '../models/card';
import { InputData } from '../models/input';
import { SwitchButton } from '../models/switchButton';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('count') count!: any;
  chartBarData: any = [[], [], []];

  cardDataTotalVisitors: Card = {
    icon: '../../../../assets/images/visitors/visitorsTotal.svg',
    title: 'Total Visitors',
    color: '#EDEDF6',
    mainResult: '15'
  };

  switchButtonData: SwitchButton = {
    firstColor: 'red',
    secondColor: 'blue',
    buttonChecked: false
  };

  buttonData: Button = {
    title: 'BlueButton',
    icon: '../assets/images/sidebar/agents.svg',
    backgroundColor: '#1C54DB',
    textColor: 'white',
    active: false
  };

  inputData: InputData = {
    value: '',
    placeholder: 'nesto'
  };

  searchInputData: any = {
    items: [],
    property: '',
    placeholder: 'search items',
    value: 'value'
  };

  constructor() {}
  ngOnInit(): void {
    this.chartBarData = [
      [56, 47, 55, 42, 0, 0, 0],
      [
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB',
        '#1C54DB'
      ],
      ['Jun 27', 'Jun 28', 'Jun 29', 'Jun 30', 'Jul 1', 'Jul 2', 'Jul 3']
    ];
    console.log(this.chartBarData);
    this.count?.data.next(this.chartBarData);
  }

  onGetSwitchButtonValue(event: any) {
    console.log(event);
  }

  onGetButtonOutput(event: any) {
    console.log(event);
  }

  onGetInputValue(event: any) {
    console.log(event.target.value);
  }
}
