import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Output
} from '@angular/core';

@Directive({
    selector: '[miniCameraVideoStream]'
})
export class peerMiniCameraAnimation {
    @HostBinding('style.transform') private transform = 'translatex(0px)';

    constructor() { }

    @HostListener('click', ['$event']) public onClick(evt: any) {
        console.log(evt)
        let timeout;
        evt.preventDefault();
        evt.stopPropagation();
        clearTimeout(timeout);
        this.transform = 'translatex(-500px)';
        timeout = setTimeout(() => {
            this.transform = 'translatex(0px)';
        }, 3000);
    }




}
