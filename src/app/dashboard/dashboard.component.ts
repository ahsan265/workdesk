/* eslint-disable no-undef */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Button } from '../models/button';
import { Card } from '../models/card';
import { InputData } from '../models/input';
import { MultiSelect } from '../models/multiSelect';
import { OneSelect } from '../models/oneSelect';
import { SearchInput } from '../models/searchInput';
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
    active: true
  };

  inputData: InputData = {
    value: '',
    placeholder: 'nesto'
  };

  searchInputData: SearchInput = {
    placeholder: 'search items',
    searchText: ''
  };

  searchText = '';

  dataForSearch: any[] = [
    { name: 'Srdjan', id: 1, lastName: 'Marinkovic' },
    { name: 'Ivana', id: 1, lastName: 'Marinkovic' },
    { name: 'Dragan', id: 1, lastName: 'Marinkovic' },
    { name: 'Dragica', id: 1, lastName: 'Marinkovic' },
    { name: 'Nikola', id: 1, lastName: 'Narancic' }
  ];

  onSelectData: OneSelect[] = [
    { id: 1, name: 'Show all', selected: true },
    { id: 2, name: 'Active', selected: false },
    { id: 3, name: 'Inactive', selected: false },
    { id: 4, name: 'Invited', selected: false }
  ];

  multiSelectData: MultiSelect = {
    showSelectAll: true,
    showSearchBar: true,
    data: [
      { id: 1, name: 'Show all', selected: false },
      { id: 2, name: 'Active', selected: false },
      { id: 3, name: 'Inactive', selected: false },
      { id: 4, name: 'Invited', selected: false },
      { id: 5, name: 'Inactive', selected: false },
      { id: 6, name: 'Inactive', selected: false },
      { id: 7, name: 'Inactive', selected: false },
      { id: 8, name: 'Inactive', selected: false },
      { id: 9, name: 'Inactive', selected: false },
      { id: 10, name: 'Inactive', selected: false },
      { id: 11, name: 'Inactive', selected: false },
      { id: 12, name: 'Inactive', selected: false },
      { id: 13, name: 'Inactive', selected: false },
      { id: 14, name: 'Inactive', selected: false },
      { id: 15, name: 'Inactive', selected: false },
      { id: 16, name: 'Inactive', selected: false },
      { id: 17, name: 'Inactive', selected: false },
      { id: 18, name: 'Inactive', selected: false },
      { id: 19, name: 'Inactive', selected: false }
    ]
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

  sendFilteredItems(event: any) {
    console.log(event);
  }

  onGetOneSelectOutput(event: OneSelect) {
    console.log(event.name);
  }

  onGetMultiSelectOutput(event: any) {
    console.log(event);
  }
}
