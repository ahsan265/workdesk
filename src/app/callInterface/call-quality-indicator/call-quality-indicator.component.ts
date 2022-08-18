import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-quality-indicator',
  templateUrl: './call-quality-indicator.component.html',
  styleUrls: ['./call-quality-indicator.component.scss']
})
export class CallQualityIndicatorComponent implements OnInit {
  @Input() callQualityValue: number = 0;
  selectIconForIndicator: string =
    '../../../assets/images/callInterface/red.svg';

  constructor() {
    if (this.callQualityValue === 0) {
      this.selectIconForIndicator =
        '../../../assets/images/callInterface/green.svg';
    } else if (
      this.callQualityValue >= 0.001 &&
      this.callQualityValue < 0.005
    ) {
      this.selectIconForIndicator =
        '../../../assets/images/callInterface/yellow.svg';
    } else if (this.callQualityValue > 0.005) {
      this.selectIconForIndicator =
        '../../../assets/images/callInterface/red.svg';
    }
  }

  ngOnInit(): void {}
}
