import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
    selector: '[editColumn]'
})
export class editColumnDirective {
    @HostBinding('style.cursor') cursor: string = 'text';
    @Output() closeField = new EventEmitter<boolean>();
    show: boolean = false;
    constructor(private ElementRef: ElementRef, private renderer: Renderer2) { }
    @HostListener('document:click', ['$event.target']) private onScroll(event: any) {
        const clickedInside: boolean = this.ElementRef.nativeElement.contains(event);
        this.renderer.selectRootElement(this.ElementRef.nativeElement).focus();
        if (clickedInside === false && this.show === true) {
            this.closeField.emit(false)
        }
        else {
            this.closeField.emit(true);
            this.show = true
        }
    }
}
