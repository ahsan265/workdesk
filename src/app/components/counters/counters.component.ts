import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.scss']
})
export class CountersComponent implements OnInit {
  @Input() counterValue!: number;
  constructor() {}

  ngOnInit(): void {}
}
