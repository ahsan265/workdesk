import { Component, OnInit } from '@angular/core';
import { ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  filename: any;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  autoTicks = false;
  showTicks = false;
  step = 5;
  thumbLabel = false;
  value = 0;
  vertical = false;
  tickInterval = 1;
  zoomoutnumber = 0;
  zoominnumber = 100;
  zoomvalue: any = 0;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imagesfile: any;
  uploadpicture: any;
  loadpicture: any;
  croppicture: any;
  progressbarvalue: any = 0;
  filesize: any;
  imageUploaded: any;
  constructor() { }

  ngOnInit(): void {
    this.uploadpicture = true;
    this.loadpicture = false;
    this.croppicture = false;
  }
  getImageOutput(event: File) {
    this.getFile(event);
  }

  bytesToSize(bytes: any) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0,
      n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  }
  saveFiles(files: FileList) {
    if (files.length > 1) {
      //   console.log(files[0].size, files[0].name, files[0].type);
    }
  }
  // get picture tranisition
  uploadpictuetransition(val: boolean) {
    if (val == true) {
      this.uploadpicture = true;
      this.loadpicture = false;
      this.croppicture = false;
    } else if (val == false) {
      this.uploadpicture = false;
      this.loadpicture = false;
      this.croppicture = false;
    }
  }
  filesDropped(event: any): void {
    this.filename = event[0].file.name;

    this.bytesToSize;
    //this.fileChangeEvent(event)
    this.uploadpicture = false;
    this.croppicture = false;
    this.imageChangedEvent = event[0].url;
    this.loadpicture = true;

    setInterval(() => {
      if (this.progressbarvalue != 100) {
        this.progressbarvalue += 1;
      }
      if (this.progressbarvalue == 100) {
        if (this.loadpicture == true) {
          this.uploadpicture = false;
          this.loadpicture = false;
          this.croppicture = true;
        }
      }
    }, 50);
  }

  getFile(event: any): void {
    this.filename = event.name;
    this.filesize = this.bytesToSize(event.size);
    this.uploadpicture = false;
    this.croppicture = false;
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      this.imageUploaded = reader.result;
    };
    this.loadpicture = true;

    setInterval(() => {
      if (this.progressbarvalue != 100) {
        this.progressbarvalue += 1;
      }
      if (this.progressbarvalue == 100) {
        if (this.loadpicture == true) {
          this.uploadpicture = false;
          this.loadpicture = false;
          this.croppicture = true;
        }
      }
    }, 50);
  }
}
