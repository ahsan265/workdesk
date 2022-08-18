import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  @Output() getUploadImage = new EventEmitter<File>();
  filename: any;
  constructor() { }
  ngOnInit(): void {
  }
  saveFiles(files: FileList) {
    if (files.length > 1) {
      console.log(files[0].size, files[0].name, files[0].type);
    }
  }
  fileChangeEvent(event: any): void {
    this.filename = event.target.files[0].name;
    this.getUploadImage.emit(event.target.files[0]);
  }

  dragImageUpload(event: any) {
    this.getUploadImage.emit(event['0']);
  }

}
