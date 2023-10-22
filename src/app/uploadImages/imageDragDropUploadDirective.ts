import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[app-fileDragDrop]'
})
export class DragNDropDirective {
  @Input() private allowed_extensions: Array<string> = ['png', 'jpg', 'bmp'];
  @Output() private filesChangeEmiter: EventEmitter<File> = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<File[]> =
    new EventEmitter();
  @HostBinding('style.background') private background = '#eee';

  constructor() {}

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

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    // let files: File = evt.dataTransfer?.files[0];
    // let valid_files: File = files;
    this.filesChangeEmiter.emit(evt.dataTransfer?.files[0]);
  }
}
