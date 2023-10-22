/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  @Output() getUploadImage = new EventEmitter<File>();
  @Output() getUploadDragImage = new EventEmitter<File>();

  filename: any;
  constructor() {}
  ngOnInit(): void {}
  saveFiles(files: FileList) {
    if (files.length > 1) {
    }
  }
  fileChangeEvent(event: any): void {
    this.filename = event.target.files[0].name;
    this.getUploadImage.emit(event);
  }

  dragImageUpload(event: any) {
    this.getUploadDragImage.emit(event);
  }
}
