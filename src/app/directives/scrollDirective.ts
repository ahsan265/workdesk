import {
    Directive,
    HostBinding,
    HostListener,
} from '@angular/core';

@Directive({
    selector: '[scroll]'
})
export class scrollStageDirective {
    isAnimated: boolean = false;
    factor!: any;
    private initPointX!: number;
    private initPointY!: number;
    @HostBinding('style.box-shadow') private beforeScroll = 'none';
    constructor() { }
    @HostListener('document:mousewheel', ['$event'])
    public onScroll(event: any) {
        (event.wheelDelta > 0) ?
            this.beforeScroll = 'none' :
            this.beforeScroll = '2px 3px 4px 0px rgb(0 0 0 / 25%)';
    }

}
