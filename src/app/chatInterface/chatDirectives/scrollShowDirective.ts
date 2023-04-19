import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from '@angular/core';

@Directive({
    selector: '[scrolling]'
})
export class scrollingDirective {
    @Input('scrollClass') scrollClass: string = '';
    constructor(private el: ElementRef) { }
    @HostBinding('style.overflow-y') private scroll = 'hidden';
    @HostListener('document:wheel', ['$event']) private onScroll(event: any) {
        if (event.target.offsetParent.className === this.scrollClass) {
            if (this.el.nativeElement.classList.contains(this.scrollClass)) {
                this.scroll = 'overlay';
            }
        }
        else{
            this.scroll = 'hidden';
        }
    }
    @HostListener('document:click', ['$event']) private onclick(event: any) {
        if (this.el.nativeElement.classList.contains(this.scrollClass)) {
            this.scroll = 'hidden';
        }
    }
}
