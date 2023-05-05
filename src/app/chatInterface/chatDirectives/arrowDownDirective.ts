import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[arrowDowm]'
})
export class scrollDownDirective {
    @Input('scrollClass') scrollClass: any = '.readingArea';
    @Output() showScrollDown = new EventEmitter();
    constructor() { }
    @HostListener('document:wheel', ['$event']) private onScroll(event: any) {
        const element = document.querySelector(this.scrollClass) as HTMLElement;
        const data = (Math.floor(element.scrollTop) === (element.scrollHeight - element.offsetHeight));
        this.showScrollDown.emit(data);
    }
}
