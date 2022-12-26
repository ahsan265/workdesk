import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calls-indicator',
  templateUrl: './calls-indicator.component.html',
  styleUrls: ['./calls-indicator.component.scss']
})
export class CallsIndicatorComponent {
  @Input() callsIndicatorData: any;

  constructor() {}
}
