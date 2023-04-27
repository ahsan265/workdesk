import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[editColumn]'
})
export class editColumnDirective {
    @Output() closeField = new EventEmitter<boolean>();
    show:boolean=false;
    constructor(private ElementRef: ElementRef) { }
    @HostListener('document:click', ['$event.target']) private onScroll(event: any) {
        const clickedInside: boolean = this.ElementRef.nativeElement.contains(event);
        if(clickedInside===false&& this.show===true )
        {
            this.closeField.emit(false)
        }
        else{
            this.closeField.emit(true);
            this.show=true
        }
    }
}
