import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[fileDragDrop]'
})

export class DragNDropDirective {
    //@Input() private allowed_extensions : Array<string> = ['png', 'jpg', 'bmp'];
    @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
    //@Output() private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();
    @HostBinding('style.background') private background = '#eee';

    constructor() { }

    @HostListener('dragover', ['$event']) public onDragOver(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = 'lightgray';
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#eee';
    }

    @HostListener('drop', ['$event']) public onDrop(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#eee';
        let files = evt.dataTransfer.files;
        let valid_files: Array<File> = files;
        this.filesChangeEmiter.emit(valid_files);
    }
}