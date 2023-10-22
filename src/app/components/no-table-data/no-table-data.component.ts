import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-table-data',
  templateUrl: './no-table-data.component.html',
  styleUrls: ['./no-table-data.component.scss']
})
export class NoTableDataComponent implements OnInit {
  @Input() notableClass: any;
  constructor() {}

  ngOnInit(): void {}
}
