import { Component, Input } from '@angular/core';
import { defaultWidgetData } from './timerWidgetData';

@Component({
  selector: 'app-timer-widget',
  templateUrl: './timer-widget.component.html',
  styleUrls: ['./timer-widget.component.scss']
})
export class TimerWidgetComponent {
  @Input() timerwWidgetData = defaultWidgetData;
}
