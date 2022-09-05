import {
    Directive,
    HostBinding,
    HostListener,
} from '@angular/core';

@Directive({
    selector: '[callControll]'
})
export class peerMiniCameraAnimation {
    @HostBinding('style.transform') private transform = 'translatey(0px)';
    constructor() { }
    @HostListener('click', ['$event']) public onClick(evt: any) {
        console.log(evt)
        let timeout;
        evt.preventDefault();
        evt.stopPropagation();
        clearTimeout(timeout);
        this.transform = 'translatey(-500px)';
        timeout = setTimeout(() => {
            this.transform = 'translatey(0px)';
        }, 3000);
    }

}
