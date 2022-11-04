import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[scroll]'
})
export class scrollStageDirective {
  @HostBinding('style.box-shadow') private beforeScroll = 'none';
  constructor() {
  }
  @HostListener('document:wheel', ['$event']) private onScroll(event: any) {
    const element = document.querySelector('.inPageWrapper') as HTMLElement;
    const element1 = document.querySelector('.filterWrapper') as HTMLElement;
    console.log(element.getBoundingClientRect().top, element1.getBoundingClientRect().bottom + 2);
    (element.getBoundingClientRect().top === element1.getBoundingClientRect().bottom + 2)
      ? (this.beforeScroll = 'none')
      : (this.beforeScroll = '2px 3px 4px 0px rgb(0 0 0 / 25%)');
  }
}
