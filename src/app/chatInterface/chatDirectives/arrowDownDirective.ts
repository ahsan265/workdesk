import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[arrowDowm]'
})
export class scrollDownDirective {
    @Input('nonScrollClass') nonScrollClass: any = '.filterWrapper';
    @Input('scrollClass') scrollClass: any = '.tableWrapper';
    @Output() showScrollDown = new EventEmitter();
    constructor() { }
    @HostListener('document:wheel', ['$event']) private onScroll(event: any) {
        const element = document.querySelector(this.scrollClass) as HTMLElement;
        const element1 = document.querySelector(this.nonScrollClass) as HTMLElement;
        console.log(element1.getBoundingClientRect().bottom, element.getBoundingClientRect().top);
        (event.deltaY < 0) ? this.showScrollDown.emit(true) : this.showScrollDown.emit(false);
    }
}
