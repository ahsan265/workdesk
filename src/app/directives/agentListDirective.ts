import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[agentScroll]'
})
export class agentScrollList {
    @Input('nonScrollClass') nonScrollClass: any = '.filterWrapper';
    @Input('scrollClass') scrollClass: any = '.tableWrapper';;

    @HostBinding('style.box-shadow') private beforeScroll = 'none';
    constructor() { }
    @HostListener('document:wheel', ['$event']) private onScroll(event: any) {
        const element = document.querySelector(this.scrollClass) as HTMLElement;
        const element1 = document.querySelector(this.nonScrollClass) as HTMLElement;
        element.getBoundingClientRect().top ===
            element1.getBoundingClientRect().bottom+2
            ? (this.beforeScroll = 'none')
            : (this.beforeScroll = '2px 3px 4px 0px rgb(0 0 0 / 25%)');
    }
}