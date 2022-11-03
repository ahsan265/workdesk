import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[scroll]'
})
export class scrollStageDirective {
  @HostBinding('style.box-shadow') private beforeScroll = 'none';
  constructor() {
    console.log();
  }
  @HostListener('document:mousewheel', ['$event'])
  public onScroll(event: any) {
    const element = document.querySelector('.inPageWrapper') as HTMLElement;
    element.getBoundingClientRect().top < 0
      ? (this.beforeScroll = '2px 3px 4px 0px rgb(0 0 0 / 25%)')
      : (this.beforeScroll = 'none');
  }
}
