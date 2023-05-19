import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaultWidgetData } from './timerWidgetData';
import { tickerModel, tickers } from 'src/app/models/preferenceModel';

@Component({
  selector: 'app-timer-widget',
  templateUrl: './timer-widget.component.html',
  styleUrls: ['./timer-widget.component.scss']
})
export class TimerWidgetComponent {
  @Input() timerwWidgetData = defaultWidgetData;
  @Output() selectedWidgetOutput = new EventEmitter<tickerModel>();
  keyUp(event: any) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      event.returnValue = false;
      event.preventDefault();
    }
  }
  getValue(event: any, ticker: tickers) {
    ticker.value = parseInt(event.target.value);
    this.timerwWidgetData.tickers.find(data => {
      if (data.header === ticker.header) {
        data.value = ticker.value;
      }
    })
    this.checkIncreatment(ticker);
    this.selectedWidgetOutput.emit(this.timerwWidgetData);
  }

  checkIncreatment(ticker: tickers) {
    switch (ticker.header) {
      case 'sec':
        if (ticker.value === 60) {
          this.findTimerSlot('min');
          ticker.value = 0;
        }
        break;
      case 'min':
        if (ticker.value === 60) {
          this.findTimerSlot('h');
          ticker.value = 0;
        }
        break;
    }
  }
  // find the slot 
  findTimerSlot(toIncrease: string) {
    this.timerwWidgetData.tickers.find(data => {
      if (data.header === toIncrease) {
        if (toIncrease === 'h' && data.value < 23) {
          data.value++;
        }
        else if (toIncrease === 'min') {
          data.value++
        }
      };
    })
  }
}

