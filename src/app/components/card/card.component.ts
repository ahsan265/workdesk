import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() cardData: any;

  iconArrowUp = '../../../../assets/images/visitors/cardArrowUp.svg';
  iconArrowDown = '../../../../assets/images/visitors/cardArrowDown.svg';

  constructor() {}
}
