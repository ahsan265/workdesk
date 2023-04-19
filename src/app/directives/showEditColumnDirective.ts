import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[editColumn]'
})
export class editColumnDirective {
    @Output() closeField = new EventEmitter<boolean>();
    constructor(private ElementRef: ElementRef) { }
    @HostListener('document:click', ['$event.target']) private onScroll(event: any) {
        const clickedInside: boolean = this.ElementRef.nativeElement.contains(event);
        (clickedInside) ? this.closeField.emit(true) : this.closeField.emit(false);
    }
}
